# RUCDAO canonical verification - powershell -ExecutionPolicy Bypass -File verify.ps1
# Exit code = number of failed checks. Covers: syntax, DOM contract, pane-scope fix,
# dual-role, Apple tokens, icons, banned words, product narrative, contracts, HTTP smoke.
# ASCII-only body (PS 5.1 reads no-BOM UTF-8 as GBK); CJK matched via \uXXXX regex escapes.
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
$script:pass = 0; $script:fail = 0
function Check($name, $ok, $detail = '') {
    if ($ok) { $script:pass++; Write-Output "[PASS] $name" }
    else { $script:fail++; Write-Output ("[FAIL] " + $name + "  " + $detail) }
}

node --check "$root\web\assets\js\app.js" 2>$null
Check 'app.js syntax' ($LASTEXITCODE -eq 0)

$html = Get-Content "$root\web\index.html" -Raw -Encoding UTF8
$js   = Get-Content "$root\web\assets\js\app.js" -Raw -Encoding UTF8
$css  = Get-Content "$root\web\assets\css\main.css" -Raw -Encoding UTF8

$ids = [regex]::Matches($js, '\$\("#([\w-]+)"\)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$missing = @($ids | Where-Object { $html -notmatch ('id="' + $_ + '"') })
Check ("DOM id cross-check (" + $ids.Count + " ids)") ($missing.Count -eq 0) ($missing -join ',')

Check 'pane-scope: activate() scoped to role container' (($js -match "closest\('div\[id\^=") -and -not ($js -match 'document\.querySelectorAll\("\.pane"\)'))
Check 'dual-role panes + issue flow' (($html -match 'id="role-student"') -and ($html -match 'id="role-publisher"') -and ($js -match 'switchRole') -and ($js -match 'data-issue'))
Check 'auth: campus email verification (@ruc.edu.cn + code)' (($html -match 'id="auth-view"') -and ($js -match 'ruc\.edu\.cn') -and ($html -match 'id="r-send"') -and ($html -match 'id="r-code"'))
Check 'publisher certification gate (cert required to publish)' (($html -match 'id="cert-card"') -and ($html -match 'id="cert-form"') -and ($js -match '\u8ba4\u8bc1') -and ($js -match 'cert !== 2'))
Check 'RUC identity (seal + motto + university)' (($html -match '\u5b9e\u4e8b\u6c42\u662f') -and ($html -match 'class="seal') -and ($html -match '\u4e2d\u56fd\u4eba\u6c11\u5927\u5b66'))
Check 'theme toggle reachable from auth screen' (($html -match 'id="auth-theme-btn"') -and ($js -match 'auth-theme-btn') -and ($css -match 'auth-theme'))
Check 'publish flow: position pricing (project-team set per role)' (($html -match 'id="pos-list"') -and ($js -match 'pos-row') -and ($js -match '\u804c\u4f4d\u5b9a\u4ef7'))
Check 'rewards: campus institution network (canteen etc.)' (($html -match 'id="inst-list"') -and ($js -match '\u5927\u4f19\u98df\u5802'))
Check 'no peer-review metering in product copy' (-not (($html + $js) -match '\u4e92\u8bc4\u5b9a\u4ef7|\u4e92\u8bc4\u8bb0\u5f55'))
Check 'Apple tokens (font/grid/radius/spring/glass/dark/reduced-motion/RUC-red)' (($css -match 'SF Pro') -and ($css -match '--space-xs: 4px') -and ($css -match '--radius-lg: 16px') -and ($css -match 'cubic-bezier\(0\.34, 1\.56') -and ($css -match 'backdrop-filter: saturate\(180%\) blur') -and ($css -match '\[data-theme="dark"\]') -and ($css -match 'prefers-reduced-motion') -and ($css -match '--accent: #8C2229'))

$iconCss = Get-Content "$root\web\assets\icons\remixicon.css" -Raw
$used = [regex]::Matches(($html + $js), 'ri-([a-z0-9-]+)') | ForEach-Object { $_.Value } | Sort-Object -Unique
$tofu = @($used | Where-Object { $iconCss -notmatch [regex]::Escape('.' + $_ + ':before') })
Check ("icons: " + $used.Count + " ri-* exist locally") (($tofu.Count -eq 0) -and ([regex]::Matches($html, 'remixicon[^"]*https?://').Count -eq 0) -and (Test-Path "$root\web\assets\icons\remixicon.woff2")) ($tofu -join ',')

$banned = '\u6316\u77ff|\u53d1\u5e01|\u4ee3\u5e01|\u5e01\u4ef7|\u5e02\u503c|\u7a7a\u6295|\u7c73\u7c92\u652f\u4ed8'
$live = [regex]::Matches(('x ' + [char]0x6316 + [char]0x77FF + ' y'), $banned).Count -eq 1
$hits = @()
foreach ($pair in @(@('index.html', $html), @('app.js', $js), @('main.css', $css))) {
    $m = [regex]::Matches($pair[1], $banned)
    if ($m.Count -gt 0) { $hits += $pair[0] }
}
Check 'banned words: regex live + zero hits' ($live -and ($hits.Count -eq 0)) ($hits -join ',')

Check 'hours peg + no-RMB-peg + zero external deps' (($html -match '1 \u5c0f\u65f6 = 100 \u7c92') -and ($js -match 'toHours') -and ($html -match '\u4e0d\u4e0e\u4eba\u6c11\u5e01\u6302\u94a9') -and (([regex]::Matches($html, 'src="https?://') + [regex]::Matches($html, '<link[^>]+href="https?://')).Count -eq 0))

Push-Location "$root\contracts"
npm run compile 2>&1 | Out-Null
$ok = ($LASTEXITCODE -eq 0) -and (Test-Path 'build\RuCoin_sol_RuCoin.bin')
Pop-Location
Check 'RuCoin.sol compile + soulbound' ($ok -and (Select-String -Path "$root\contracts\RuCoin.sol" -Pattern 'RUCOIN: soulbound credit, non-transferable' -Encoding UTF8 -Quiet))

# HTTP smoke (auto-start the demo server if it is not already up)
$base = 'http://localhost:8340'
$spawned = $null
try { $null = Invoke-WebRequest "$base/" -UseBasicParsing -TimeoutSec 3 } catch {
    $spawned = Start-Process python -ArgumentList '-m','http.server','8340' -WorkingDirectory "$root\web" -PassThru -WindowStyle Hidden
    Start-Sleep 2
}
foreach ($p in @('/', '/assets/css/main.css', '/assets/js/app.js', '/assets/icons/remixicon.css')) {
    try { $rr = Invoke-WebRequest ($base + $p) -UseBasicParsing -TimeoutSec 5; Check ("HTTP 200 " + $p) ($rr.StatusCode -eq 200) }
    catch { Check ("HTTP 200 " + $p) $false }
}
if ($spawned) { Stop-Process -Id $spawned.Id -ErrorAction SilentlyContinue }

Write-Output ("---- verify summary: " + $script:pass + " passed, " + $script:fail + " failed ----")
exit $script:fail
