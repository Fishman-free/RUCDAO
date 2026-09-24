# RUCDAO · 人大校内志愿服务 DAO 平台

> **PoV（Proof of Volunteer，志愿服务贡献证明）——让每一次志愿服务都被看见、被记录、有回响。**
> 灵感来自乡建DAO（ETHShanghai 2026）的"任务帖 + 稻米积分 + 链上徽章"机制。
> 发起：人民大学信息学院志愿服务部。

## 这是什么

RUCDAO 把全校志愿项目整合到一个平台：学生自由浏览报名，参与即产出 **PoV 贡献证明**，获得**米粒（RUCOIN）**——一种**与人民币不挂钩、不可充值、不可转让的志愿服务贡献凭证**（对标乡建DAO 的"稻米"）。米粒**兑面包券等消费券**、兑权益、点亮链上 SBT 徽章；志愿时长经平台**直通车如实录入"志愿北京"**。

**RUCOIN 就是志愿时数的认证方式**：1 小时 = 100 粒，余额即认证时数账本，与志愿北京时数对标。

**双端架构**：**学生端**（广场 / 项目库 / 权益商店 / 我的）寻找并完成志愿、兑回响；**发布端**（发布台 / 项目管理 / 发放台）发布志愿、确认服务、一键发放时数（入账 + 链上存证 + 志愿北京批量录入）。

**三条铁律**：RUCOIN 对标志愿时数、不与人民币挂钩 · 时数只按真实服务认证 · 发放规则公开共治。

**设计体系**：Apple Design System（SF Pro 字体栈、4pt 栅格、毛玻璃导航、Spring 动效、深浅双模式），人大红 `#8C2229` 品牌主色，Remix Icon 本地化图标。

## 仓库结构

```
RUCDAO/
├── docs/
│   ├── 01-乡建DAO调研报告.md      # 乡建DAO 的写作形式 / 稻米机制 / 技术栈 / 黑客松
│   ├── 02-可行性与合规分析.md      # 可行性裁决 + 监管红线 + 兑换体系重构
│   └── 03-RUCDAO项目计划书.md      # 完整项目计划书（产品 / 经济 / 架构 / 里程碑）
├── contracts/
│   └── RuCoin.sol                # 米粒贡献凭证合约（灵魂绑定，transfer 永久禁用）
└── web/                          # 平台 v0.2 双端原型（学生端 + 发布端，Apple 设计体系，可交互）
    ├── index.html
    └── assets/{css,js}/
```

## 快速开始（保姆级 · 5 分钟跑起来）

面向第一次拿到代码的同学。以下命令都在 **PowerShell**（Windows）里执行；用 Mac/Linux 则在终端执行，命令相同。

### 第 0 步：准备环境（装过可跳过）

需要三样东西。装完后各敲一条命令，**能打印出版本号就算装好**（报"'xxx'不是内部或外部命令"就是没装，或装完没重开 PowerShell）：

| 工具 | 用途 | 下载 | 确认装好的命令 |
|---|---|---|---|
| Git | 拉代码 | <https://git-scm.com/download/win> | `git --version` |
| Python 3 | 给原型起本地服务 | <https://www.python.org/downloads/> | `python --version` |
| Node.js 18+ | 跑验证、编译合约 | <https://nodejs.org> | `node --version` |

### 第 1 步：拿到代码

```powershell
cd C:\Users\21560\Desktop
git clone https://github.com/Fishman-free/RUCDAO.git
cd C:\Users\21560\Desktop\RUCDAO
```

**看到目录里有 `docs`、`web`、`contracts`、`verify.ps1` 就成功了。** 以下命令均使用绝对路径，在其他电脑上操作时把 `C:\Users\21560` 替换为自己的用户目录即可。

### 第 2 步：启动原型（只想看界面，到这步为止）

```powershell
cd C:\Users\21560\Desktop\RUCDAO\web
python -m http.server 8340
```

**看到 `Serving HTTP on :: port 8340` 就成功了。** 注意：这个窗口会停住不动——**这是正常的**，它就是服务器本身，别关它、也别以为卡死了。

然后用浏览器打开 **<http://localhost:8340>**，应该看到 RUCDAO 首页（PoV 大标题 + 任务卡片流）。

- 页面左上角切换「学生端 / 发布端」，右上角圆形按钮切换深浅色；
- 想停服务器：回到那个窗口按 **Ctrl + C**。

> **卡点自救**
> - 报 `python 不是内部或外部命令` → 换 `py -m http.server 8340` 再试；还不行就是 Python 没装（回第 0 步）。
> - 报 `Address already in use` / 端口被占 → 换个端口：`python -m http.server 8400`，浏览器地址也换成 `:8400`。
> - 浏览器打不开 / 空白 → 先确认服务器窗口那行 `Serving HTTP...` 在，再看地址是不是 `http://localhost:8340`（不是 https）。

### 第 3 步：跑全量验证（可选，动代码前建议跑一次）

**新开一个 PowerShell 窗口**（第 2 步那个窗口被服务器占着），进仓库根目录：

```powershell
cd C:\Users\21560\Desktop\RUCDAO
npm test
```

**看到 `verify summary: 16 passed, 0 failed` 就全绿了**（覆盖：JS 语法 / 双端流程 / 职位定价 / 受理网络 / 禁词 / 合约编译 / HTTP 冒烟）。退出码 = 失败数，0 就是全过。不想用 npm 也可以直接跑：`powershell -ExecutionPolicy Bypass -File verify.ps1`。

### 第 4 步：编译合约（可选）

```powershell
cd C:\Users\21560\Desktop\RUCDAO\contracts
npm install        # 装 Solidity 编译器，首次约 1 分钟
npm run compile
```

**看到 `contracts/build/` 下生成 `.abi` 和 `.bin` 文件就成功了。**

### 30 秒玩法导览

1. 学生端「广场」→ 任选卡片点"接单 / 报名"，去「我的」看时数账本入账；
2. 「权益商店」→ 兑一张"后勤面包券"，生成一次性核销码（限本人 · 当日有效）；
3. 切「发布端」→ 「发布台」用**职位定价表**发布项目（添加职位 → 逐职位定米粒）→ 切「发放台」点"发放 + 上链存证"，再切回学生端看余额入账——这就是一条完整的"发布 → 参与 → 时数认证"链路。

## 合规声明

RUCOIN（米粒）是志愿服务**贡献凭证/积分**：不可转让、不可交易、**不可兑换法定货币**，不构成任何投资标的或代币发行融资。志愿时长仅按真实服务在"志愿北京"如实记录。本仓库合约代码仅部署于测试网/联盟链用于存证演示。

## 路线图

- **M0（2026 秋）**：立项、原型、种子项目 ✅ 进行中
- **M1（2027 春）**：WordPress + RUCDAO Core 插件版上线，2 院系试点
- **M2（2027 秋）**：全校推广 + 首届"科技走入乡村"黑客松
- **M3（2028—）**：开源输出兄弟高校 / 乡建DAO 社区

详见 [docs/03-RUCDAO项目计划书.md](docs/03-RUCDAO项目计划书.md)。
