/* RUCDAO v0.2 — 学生端 / 发布端 双端原型（Apple Design System）
 * RUCOIN = 志愿时数认证：1 小时 = 100 粒，余额即时数账本。
 * 演示数据本地模拟；链上存证由 contracts/RuCoin.sol 承担。 */
(function () {
  "use strict";

  // ---------------- 演示数据 ----------------
  var feed = [
    { type: "task", field: "技能", title: "校园开放日活动跟拍", node: "校团委新媒体中心",
      body: ["内容：全程记录校园开放日，产出精修图 20 张 + 1 分钟花絮。", "要求：有相机，按时交付，素材授权校方使用。"],
      reward: 500, slots: 1 },
    { type: "task", field: "技能", title: "“我最难忘的一次志愿服务”图文征集", node: "信息学院志愿服务部",
      body: ["内容：千字以内图文一则，记录真实志愿故事。", "要求：原创，可在广场连载。"],
      reward: 200, slots: 10 },
    { type: "proj", field: "乡村", title: "“科技走入乡村”龙潭村数字夏令营", node: "RUCDAO × 乡建DAO 联合节点",
      body: ["岗位清单：授课 6 人（800 粒/人）、摄影 1 人（500 粒）、助教 2 人（600 粒）。", "多劳多得：额外产出需求文档另计 300 粒。"],
      reward: 800, slots: 9 },
    { type: "proj", field: "助老", title: "银龄数字课堂 · 教老人用智能手机", node: "青志协助老服务队",
      body: ["每周六上午，社区党群服务中心。", "每期 2 小时 × 1.2 系数 = 240 粒/期，满 8 期点亮「银龄之友」徽章。"],
      reward: 240, slots: 4 },
    { type: "task", field: "技能", title: "志愿市集摊位海报设计", node: "校志协宣传部",
      body: ["内容：A2 海报 1 张 + 朋友圈版式 1 套。", "要求：含 RUCDAO 米粒元素。"],
      reward: 300, slots: 2 },
    { type: "proj", field: "技能", title: "共学共创工作坊 #04：AI 也能做志愿项目管理", node: "信息学院志愿服务部",
      body: ["10 月 18 日 19:00，信息楼报告厅。", "米粒抵扣：报名费 50 粒（到场全额返还 + 赠 30 粒）。"],
      reward: 30, slots: 60 }
  ];

  var projects = [
    { title: "电脑义诊 · 教工社区站", field: "技能", node: "信息学院志愿服务部", place: "校内 · 教工社区", time: "10.26 周六 14:00", slots: 8, left: 3, hours: 4, ratio: 1.5 },
    { title: "校园垃圾分类督导", field: "环保", node: "环境学院青志协", place: "校内 · 六大宿舍区", time: "每周三 17:30", slots: 12, left: 6, hours: 2, ratio: 1 },
    { title: "社区数字支教（编程启蒙）", field: "支教", node: "RUCDAO 支教节点", place: "海淀区 · 定慧里社区", time: "每周日 09:30", slots: 6, left: 2, hours: 3, ratio: 1.5 },
    { title: "129 合唱展演志愿服务", field: "赛会", node: "校学生会", place: "校内 · 如论讲堂", time: "12.08 全天", slots: 30, left: 30, hours: 6, ratio: 1 },
    { title: "乡村振兴调研助理（龙潭村）", field: "乡村", node: "RUCDAO × 乡建DAO", place: "福建屏南 · 熙岭乡", time: "寒假 7 天", slots: 10, left: 10, hours: 56, ratio: 2 },
    { title: "图书馆古籍数字化助理", field: "技能", node: "图书馆", place: "校内 · 古籍部", time: "每周二 14:00", slots: 4, left: 1, hours: 3, ratio: 1.5 },
    { title: "导盲犬基地助盲行动", field: "助老", node: "青志协助残服务队", place: "昌平 · 导盲犬基地", time: "11.02 周日", slots: 15, left: 9, hours: 5, ratio: 1.2 },
    { title: "校运会赛事志愿服务", field: "赛会", node: "体育部", place: "校内 · 田径场", time: "10.31—11.01", slots: 40, left: 22, hours: 8, ratio: 1 }
  ];

  var rewards = [
    { icon: "ri-coupon-fill",     title: "后勤面包券 · 1 张",   cost: 300,  note: "学一食堂面包房 · 限本人 · 当日有效 · 一次性核销", voucher: true },
    { icon: "ri-cup-fill",        title: "面包房咖啡券",        cost: 400,  note: "券源商户赞助 · 一次性核销", voucher: true },
    { icon: "ri-restaurant-fill", title: "大伙食堂基本伙代金券 10 元", cost: 800, note: "大伙食堂（基本伙）· 一次性核销", voucher: true },
    { icon: "ri-shopping-bag-fill", title: "校园超市代金券 5 元", cost: 450,  note: "校园超市 · 一次性核销", voucher: true },
    { icon: "ri-printer-fill",    title: "打印券 50 页",        cost: 400,  note: "图书馆文印中心" },
    { icon: "ri-gift-fill",       title: "RUCDAO 文创卫衣",     cost: 3000, note: "稻穗印章限定款 · 每学期 50 件" },
    { icon: "ri-bus-2-fill",      title: "名企参访名额",        cost: 2500, note: "每学期 2 次 · 含车旅" },
    { icon: "ri-seedling-fill",   title: "暑期乡村实践优先名额", cost: 3500, note: "龙潭村等共建村庄" },
    { icon: "ri-award-fill",      title: "年度志愿之星奖杯 + 证书", cost: 5000, note: "校志协年会颁发 · 附荣誉徽章" }
  ];

  var institutions = [
    { name: "大伙食堂（基本伙）", items: "基本伙代金券", status: "洽谈中" },
    { name: "学一食堂面包房", items: "面包券 · 咖啡券", status: "已签约" },
    { name: "校园超市", items: "超市代金券", status: "洽谈中" },
    { name: "图书馆文印中心", items: "打印券", status: "已签约" },
    { name: "体育馆 / 洗衣房", items: "场地券 · 洗衣券", status: "规划中" }
  ];

  var ledger = [
    { amt: 240,  txt: "银龄数字课堂 · 第 3 期（2h × 1.2）",   hash: "0x7a3f…c210 · recordService #R-0412" },
    { amt: -50,  txt: "工作坊 #04 报名费抵扣",                hash: "0x15be…88aa · redeem #W-0007" },
    { amt: 500,  txt: "新生报到跟拍验收通过",                  hash: "0x9d02…4f31 · award #T-0056" },
    { amt: 600,  txt: "电脑义诊 · 教工社区站（4h × 1.5）",    hash: "0x3c81…b7e2 · recordService #R-0388" },
    { amt: -300, txt: "兑换：后勤面包券",                     hash: "0x6af4…1d09 · redeem #C-0231" },
    { amt: 300,  txt: "运动会海报设计赏金",                    hash: "0xbe07…77c4 · award #T-0049" }
  ];

  var badges = [
    { icon: "ri-star-fill",           n: "星级志愿者" },
    { icon: "ri-checkbox-circle-fill", n: "校园摄影" },
    { icon: "ri-settings-3-fill",     n: "硬件维修" }
  ];

  var ranks = [
    { name: "王小禾", h: 41.2 }, { name: "林一舟", h: 38.8 }, { name: "赵麦", h: 35.5 }
  ];

  var myProjects = [
    { title: "电脑义诊 · 教工社区站", field: "技能", joined: 5, confirmed: 3,
      positions: [{ name: "硬件维修员", slots: 5, price: 600 }, { name: "咨询引导员", slots: 3, price: 300 }] },
    { title: "银龄数字课堂 · 第 5 期", field: "助老", joined: 4, confirmed: 0,
      positions: [{ name: "授课志愿者", slots: 3, price: 240 }, { name: "助教", slots: 1, price: 180 }] },
    { title: "【任务】市集海报设计", field: "技能", joined: 2, confirmed: 1,
      positions: [{ name: "平面设计", slots: 2, price: 450 }] }
  ];

  var issueList = [
    { name: "王小禾", project: "电脑义诊 · 教工社区站", position: "硬件维修员", price: 600 },
    { name: "林一舟", project: "电脑义诊 · 教工社区站", position: "硬件维修员", price: 600 },
    { name: "赵麦",   project: "【任务】市集海报设计",  position: "平面设计",   price: 450 }
  ];

  var state = { balance: 2340, filter: "全部", joined: {}, redeemed: {}, vouchers: [], issued: {}, user: null, sentCode: null, certApplying: false };

  // ---------------- 工具 ----------------
  function $(sel) { return document.querySelector(sel); }
  function fmt(n) { return n.toLocaleString("en-US"); }
  function toHours(mili) { return (mili / 100).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function updateBalance() {
    $("#balance-quick").textContent = fmt(state.balance);
    $("#balance-main").textContent = fmt(state.balance);
    $("#hours-quick").textContent = toHours(state.balance);
    $("#hours-main").textContent = toHours(state.balance);
  }

  // ---------------- 渲染：学生端 ----------------
  function renderFeed() {
    $("#feed-list").innerHTML = feed.map(function (p, i) {
      return '<article class="card">' +
        '<span class="post-type ' + (p.type === "task" ? "task" : "") + '">' + (p.type === "task" ? "【任务】" : "【招募】") + esc(p.field) + '</span>' +
        '<h3 class="post-title">' + esc(p.title) + '</h3>' +
        '<div class="post-body">' + p.body.map(function (b) { return "<p>" + esc(b) + "</p>"; }).join("") + '</div>' +
        '<div class="post-meta"><span>发布节点：<b>' + esc(p.node) + '</b></span>' +
        '<span>' + fmt(p.reward) + ' 粒 ≈ ' + toHours(p.reward) + ' 小时</span>' +
        '<span><i class="ri-group-line" aria-hidden="true"></i> ' + p.slots + ' 个名额</span>' +
        '<button class="btn btn--gray" data-join-feed="' + i + '">接单 / 报名</button></div>' +
        '</article>';
    }).join("");
  }

  function renderFilters() {
    var fields = ["全部", "支教", "环保", "助老", "赛会", "技能", "乡村"];
    $("#filters").innerHTML = fields.map(function (f) {
      return '<button class="chip' + (f === state.filter ? " active" : "") + '" data-filter="' + f + '">' + f + '</button>';
    }).join("");
  }

  function renderProjects() {
    var list = projects.filter(function (p) { return state.filter === "全部" || p.field === state.filter; });
    $("#project-grid").innerHTML = list.map(function (p) {
      var idx = projects.indexOf(p);
      var joined = state.joined[idx];
      var reward = Math.round(p.hours * 100 * p.ratio);
      return '<article class="card proj-card">' +
        '<span class="tag ' + esc(p.field) + '">' + esc(p.field) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="proj-meta">' + esc(p.node) + '</p>' +
        '<p class="proj-meta"><i class="ri-map-pin-line" aria-hidden="true"></i>' + esc(p.place) + '</p>' +
        '<p class="proj-meta"><i class="ri-calendar-line" aria-hidden="true"></i>' + esc(p.time) + ' · ' + p.hours + ' 小时/人</p>' +
        '<p class="proj-meta"><i class="ri-group-line" aria-hidden="true"></i>' + p.slots + ' 岗 · 剩 ' + p.left + '</p>' +
        '<div class="proj-reward"><b>' + fmt(reward) + ' 粒 ≈ ' + toHours(reward) + ' h</b>' +
        '<button class="btn btn--filled" data-join="' + idx + '"' + (joined ? " disabled" : "") + '>' + (joined ? "已报名 ✓" : "立即报名") + '</button></div>' +
        '</article>';
    }).join("") || '<p class="muted">该领域暂无项目，去广场看看悬赏任务？</p>';
  }

  function renderRewards() {
    $("#reward-grid").innerHTML = rewards.map(function (r, i) {
      return '<article class="card reward-card">' +
        '<span class="reward-icon"><i class="' + esc(r.icon) + '" aria-hidden="true"></i></span>' +
        '<h3 style="font-size:17px;font-weight:700;margin:0 0 4px">' + esc(r.title) + '</h3>' +
        '<p class="muted">' + esc(r.note) + '</p>' +
        '<p class="reward-cost">' + fmt(r.cost) + ' 粒<small> ≈ ' + toHours(r.cost) + ' 小时</small></p>' +
        '<button class="btn btn--filled" data-buy="' + i + '"' + (state.redeemed[i] ? " disabled" : "") + '>' + (state.redeemed[i] ? "已兑换 ✓" : "兑换") + '</button>' +
        '</article>';
    }).join("");
  }

  function renderLedger() {
    $("#ledger").innerHTML = ledger.map(function (l) {
      return '<div class="ledger-row"><span>' + esc(l.txt) + '<span class="ledger-hash">' + esc(l.hash) + '</span></span>' +
        '<span class="ledger-amt ' + (l.amt > 0 ? "plus" : "minus") + '">' + (l.amt > 0 ? "+" : "") + fmt(l.amt) + ' 粒</span></div>';
    }).join("");
  }

  function renderBadges() {
    $("#badges").innerHTML = badges.map(function (b) {
      return '<div class="badge-seal"><i class="' + esc(b.icon) + '" aria-hidden="true"></i>' + esc(b.n) + '</div>';
    }).join("");
  }

  function renderVouchers() {
    var el = $("#voucher-list");
    if (!state.vouchers.length) {
      el.innerHTML = '<p class="muted">暂无券。去权益商店兑一张面包券试试。</p>';
      return;
    }
    el.innerHTML = state.vouchers.map(function (v) {
      return '<div class="voucher"><b>' + esc(v.title) + '</b>' +
        '<span class="voucher-code">' + esc(v.code) + '</span>' +
        '<span class="voucher-note">' + esc(v.note) + '</span></div>';
    }).join("");
  }

  function renderInstitutions() {
    var el = $("#inst-list");
    if (!el) return;
    el.innerHTML = institutions.map(function (it) {
      return '<span class="inst-chip"><b>' + esc(it.name) + '</b>' + esc(it.items) + '<i>' + esc(it.status) + '</i></span>';
    }).join("");
  }

  function renderRank() {
    $("#rank-list").innerHTML = ranks.map(function (r) {
      return '<li><span class="rank-name">' + esc(r.name) + '</span><span class="rank-num">' + r.h.toFixed(1) + ' h</span></li>';
    }).join("");
  }

  // ---------------- 账号：校内邮箱认证 + 发布者认证 ----------------
  function validEmail(v) { return /^[^@\s]+@ruc\.edu\.cn$/i.test((v || "").trim()); }
  function showAuth() { $("#auth-view").hidden = false; }
  function hideAuth() { $("#auth-view").hidden = true; }
  function requireLogin(msg) {
    if (state.user) return true;
    showAuth();
    toast(msg || "请先登录：校内邮箱一键认证。");
    return false;
  }
  function loginAs(u) {
    state.user = u;
    hideAuth();
    $("#account-label").textContent = u.sid;
    renderAccount(); renderCert();
    toast("欢迎，" + u.email.split("@")[0] + " ✓ 校内邮箱认证通过。");
  }
  function logout() {
    state.user = null; state.certApplying = false;
    $("#account-label").textContent = "登录";
    renderAccount(); renderCert();
    showAuth();
    toast("已退出登录。");
  }
  function renderAccount() {
    var el = $("#me-account");
    if (!state.user) {
      el.innerHTML = '<p class="muted">未登录。注册与登录仅限校内邮箱（@ruc.edu.cn）。</p><button class="btn btn--tinted" data-open-auth>登录 / 注册</button>';
      return;
    }
    var u = state.user;
    var cert = u.cert === 2 ? "已认证" : u.cert === 1 ? "认证中" : "未认证";
    el.innerHTML =
      '<p class="acc-row"><span>校内邮箱</span><b>' + esc(u.email) + '</b></p>' +
      '<p class="acc-row"><span>学号 / 工号</span><b>' + esc(u.sid) + '</b></p>' +
      '<p class="acc-row"><span>发布者认证</span><b>' + cert + (u.cert === 2 ? ' · ' + esc(u.org) : '') + '</b></p>' +
      '<button class="btn btn--plain" data-logout>退出登录</button>';
  }
  function renderCert() {
    var el = $("#cert-body");
    if (!el) return;
    var form = $("#cert-form");
    var u = state.user;
    if (!u) {
      form.hidden = true;
      el.innerHTML = '<p class="muted">只有实名认证的志愿组织可以发布项目。请先登录（校内邮箱）。</p>';
      return;
    }
    if (u.cert === 2) {
      form.hidden = true;
      el.innerHTML = '<p class="cert-ok"><i class="ri-verified-badge-fill" aria-hidden="true"></i>已认证 · ' + esc(u.org) + ' · ' + esc(u.job) + '</p>' +
        '<p class="muted">认证编号 RUC-DA-' + esc(u.sid) + '（演示）· 你发布的项目将标注认证组织。</p>';
      return;
    }
    if (u.cert === 1) {
      form.hidden = true;
      el.innerHTML = '<p class="muted">认证中……校团委备案复核（演示：稍候自动通过）。</p>';
      return;
    }
    el.innerHTML = '<p class="muted">只有实名认证的志愿组织（校志协、院系志协、社团、项目组）可以发布志愿项目，认证在校团委备案。</p>' +
      '<button type="button" class="btn btn--tinted" data-cert-start' + (state.certApplying ? ' hidden' : '') + '>申请发布者认证</button>';
    form.hidden = !state.certApplying;
  }

  // ---------------- 渲染：发布端 ----------------
  function renderManage() {
    $("#manage-list").innerHTML = myProjects.map(function (p, i) {
      return '<article class="card mg-card">' +
        '<div><span class="tag ' + esc(p.field) + '">' + esc(p.field) + '</span>' +
        '<h3 style="font-size:17px;font-weight:700;margin:4px 0">' + esc(p.title) + '</h3>' +
        '<p class="muted">职位定价：' + p.positions.map(function (q) { return esc(q.name) + ' ' + q.slots + ' 人 × ' + fmt(q.price) + ' 粒'; }).join('；') + '</p></div>' +
        '<div><div class="mg-progress">' +
        '<div><strong>' + p.joined + '/' + p.positions.reduce(function (s, q) { return s + q.slots; }, 0) + '</strong><span>已报名</span></div>' +
        '<div><strong>' + p.confirmed + '</strong><span>已确认服务</span></div>' +
        '</div><div class="mg-actions" style="margin-top:12px">' +
        '<button class="btn btn--tinted" data-confirm="' + i + '">确认服务记录</button>' +
        '</div></div></article>';
    }).join("");
  }

  function renderIssues() {
    $("#issue-list").innerHTML = issueList.map(function (r, i) {
      var amt = r.price;
      var done = state.issued[i];
      return '<div class="issue-row">' +
        '<div class="issue-who"><b>' + esc(r.name) + '</b><span class="muted">' + esc(r.project) + ' · ' + esc(r.position) + '（职位定价）</span></div>' +
        '<div class="issue-amt"><b>' + fmt(amt) + ' 粒</b><span>= ' + toHours(amt) + ' 小时认证时数</span></div>' +
        '<button class="btn btn--filled" data-issue="' + i + '"' + (done ? " disabled" : "") + '>' +
        '<i class="ri-hand-heart-fill" aria-hidden="true"></i>' + (done ? "已发放 ✓" : "发放 + 上链存证") + '</button></div>';
    }).join("") || '<p class="muted">暂无待发放记录。</p>';
  }

  // ---------------- 角色与标签切换 ----------------
  function switchRole(role) {
    document.querySelectorAll(".seg-btn").forEach(function (b) {
      var on = b.dataset.role === role;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $("#role-student").hidden = role !== "student";
    $("#role-publisher").hidden = role !== "publisher";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindTabs(attr) {
    document.querySelectorAll("[" + attr + "]").forEach(function (b, i, all) {
      b.addEventListener("click", function () { activate(b, attr); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); var n = all[(i + d + all.length) % all.length]; n.focus(); activate(n, attr); }
      });
    });
    function activate(btn, a) {
      document.querySelectorAll("[" + a + "]").forEach(function (x) {
        var on = x === btn;
        x.classList.toggle("active", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
      });
      // 只在当前角色容器内切换面板——避免发布端的 tab 点击熄掉学生端的面板
      var scope = btn.closest('div[id^="role-"]') || document;
      scope.querySelectorAll(".pane").forEach(function (s) { s.classList.remove("active"); });
      $("#" + btn.getAttribute(a)).classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ---------------- 主题 ----------------
  function initTheme() {
    var saved = localStorage.getItem("rucdao-theme");
    var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    syncThemeIcon();
  }
  function syncThemeIcon() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var icon = '<i class="ri-' + (dark ? "sun-fill" : "moon-fill") + '" aria-hidden="true"></i>';
    $("#theme-btn").innerHTML = icon;
    $("#auth-theme-btn").innerHTML = icon;
  }
  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("rucdao-theme", next);
    syncThemeIcon();
    toast(next === "dark" ? "已切换深色模式" : "已切换浅色模式");
  }
  $("#theme-btn").addEventListener("click", toggleTheme);
  $("#auth-theme-btn").addEventListener("click", toggleTheme);

  // ---------------- 交互 ----------------
  document.querySelectorAll(".seg-btn").forEach(function (b) {
    b.addEventListener("click", function () { switchRole(b.dataset.role); });
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;

    if (t.dataset.goto) {
      var g = document.querySelector('[data-stab="' + t.dataset.goto + '"]');
      if (g) g.click();
    }
    if (t.id === "account-btn") {
      if (state.user) { var g2 = document.querySelector('[data-stab="s-me"]'); if (g2) g2.click(); }
      else showAuth();
    }
    if (t.id === "auth-skip") loginAs({ email: "demo@ruc.edu.cn", sid: "2023xxxxxx", cert: 2, org: "信息学院志愿服务部", job: "演示管理员" });
    if (t.hasAttribute("data-open-auth")) showAuth();
    if (t.hasAttribute("data-logout")) logout();
    if (t.hasAttribute("data-cert-start")) { state.certApplying = true; renderCert(); }
    if (t.dataset.authtab) {
      document.querySelectorAll("[data-authtab]").forEach(function (x) {
        var on = x === t;
        x.classList.toggle("active", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
      });
      $("#login-form").hidden = t.dataset.authtab !== "login";
      $("#reg-form").hidden = t.dataset.authtab !== "register";
    }
    if (t.id === "r-send") {
      if (!validEmail($("#r-email").value)) { toast("仅限校内邮箱（@ruc.edu.cn）注册。"); return; }
      state.sentCode = String(Math.floor(100000 + Math.random() * 900000));
      toast("演示验证码：" + state.sentCode + "（正式版将发送至该邮箱）");
    }
    if (t.dataset.filter) { state.filter = t.dataset.filter; renderFilters(); renderProjects(); }
    if (t.dataset.join !== undefined && !state.joined[t.dataset.join]) {
      if (!requireLogin()) return;
      state.joined[t.dataset.join] = true; renderProjects();
      toast("报名成功 ✓ 服务确认后时数自动认证入账。");
    }
    if (t.dataset.joinFeed !== undefined) {
      if (!requireLogin()) return;
      toast("已接单 ✓ 完成后提交交付物，验收通过即认证时数。");
    }
    if (t.dataset.buy !== undefined && !state.redeemed[t.dataset.buy]) {
      if (!requireLogin()) return;
      var r = rewards[+t.dataset.buy];
      if (state.balance < r.cost) { toast("米粒不足——去项目库接个项目攒时数吧。"); return; }
      state.redeemed[t.dataset.buy] = true;
      state.balance -= r.cost;
      ledger.unshift({ amt: -r.cost, txt: "兑换：" + r.title, hash: "0x" + Math.random().toString(16).slice(2, 6) + "…演示 · redeem" });
      var msg = "兑换成功（演示）· 到出示核销即可。";
      if (r.voucher) {
        var code = "RN-" + Math.random().toString(16).slice(2, 6).toUpperCase() + "-" + Math.random().toString(16).slice(2, 6).toUpperCase();
        state.vouchers.unshift({ title: r.title, code: code, note: "限本人 · 当日有效 · 一次性核销" });
        msg = "兑券成功（演示）· 券码 " + code + " 已存入券包。";
      }
      updateBalance(); renderRewards(); renderLedger(); renderVouchers();
      toast(msg);
    }
    if (t.dataset.confirm !== undefined) {
      if (!requireLogin()) return;
      var p = myProjects[+t.dataset.confirm];
      p.confirmed = p.joined;
      renderManage();
      toast("服务记录已确认 ✓ 切到「发放台」一键发放时数。");
    }
    if (t.dataset.issue !== undefined && !state.issued[t.dataset.issue]) {
      if (!requireLogin()) return;
      var rec = issueList[+t.dataset.issue];
      var amt = rec.price;
      state.issued[t.dataset.issue] = true;
      state.balance += amt;
      ledger.unshift({ amt: amt, txt: rec.name + " · " + rec.project + " 发放", hash: "0x" + Math.random().toString(16).slice(2, 6) + "…演示 · award" });
      renderIssues(); updateBalance(); renderLedger();
      toast("已发放 " + fmt(amt) + " 粒（= " + toHours(amt) + " 小时认证时数）· 链上存证 + 志愿北京批量录入中。");
    }
    if (t.id === "wallet-btn-2") { connectWallet(); }
  });

  async function connectWallet() {
    if (window.ethereum && window.ethereum.request) {
      try {
        var accts = await window.ethereum.request({ method: "eth_requestAccounts" });
        var msg = "RUCDAO 钱包绑定（测试网演示）\n学号: 2023xxxxxx\n地址: " + accts[0];
        await window.ethereum.request({ method: "personal_sign", params: [msg, accts[0]] });
        var short = accts[0].slice(0, 6) + "…" + accts[0].slice(-4);
        $("#wallet-btn-2").innerHTML = '<i class="ri-wallet-3-fill" aria-hidden="true"></i>' + short;
        $("#wallet-state").innerHTML = "已绑定自有钱包 <b>" + short + "</b>（签名验证通过）。RUCOIN 对标时数，不可转账。";
        toast("钱包绑定成功 ✓ 签名已验证。");
      } catch (err) { toast("已取消绑定。托管钱包（学号即账户）继续可用。"); }
    } else {
      toast("未检测到自有钱包 —— 已用托管钱包（学号即账户）进入演示模式。");
    }
  }

  // 发布表单：职位定价（项目组逐职位核定，不设互评）
  function posRow(name, slots, price) {
    var div = document.createElement("div");
    div.className = "pos-row";
    div.innerHTML = '<input class="pos-name" placeholder="职位名，如 授课志愿者" value="' + (name || '') + '">' +
      '<input class="pos-slots" type="number" min="1" placeholder="人数" value="' + (slots || 1) + '">' +
      '<input class="pos-price" type="number" min="0" placeholder="米粒/人" value="' + (price || '') + '">' +
      '<button type="button" class="icon-btn pos-del" aria-label="删除职位"><i class="ri-delete-bin-line" aria-hidden="true"></i></button>';
    div.querySelector(".pos-del").addEventListener("click", function () {
      if (document.querySelectorAll(".pos-row").length > 1) { div.remove(); } else { toast("至少保留一个职位。"); }
      preview();
    });
    div.addEventListener("input", preview);
    $("#pos-list").appendChild(div);
    preview();
  }
  function preview() {
    var total = 0;
    document.querySelectorAll(".pos-row").forEach(function (row) {
      total += (+row.querySelector(".pos-slots").value || 0) * (+row.querySelector(".pos-price").value || 0);
    });
    $("#p-preview").textContent = fmt(total);
    $("#p-preview-h").textContent = toHours(total);
  }
  $("#pos-add").addEventListener("click", function () { posRow(); });
  $("#publish-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!requireLogin("请先登录后再发布。")) return;
    if (state.user.cert !== 2) {
      state.certApplying = true; renderCert();
      $("#cert-card").scrollIntoView({ behavior: "smooth", block: "center" });
      toast("发布需先完成发布者认证（实名组织备案）。");
      return;
    }
    var positions = [];
    document.querySelectorAll(".pos-row").forEach(function (row) {
      var n = row.querySelector(".pos-name").value.trim() || "志愿者";
      var s = +row.querySelector(".pos-slots").value || 1;
      var pr = +row.querySelector(".pos-price").value || 0;
      if (pr > 0) positions.push({ name: n, slots: s, price: pr });
    });
    if (!positions.length) { toast("请为至少一个职位核定米粒数。"); return; }
    myProjects.unshift({
      title: $("#p-title").value, field: $("#p-field").value,
      joined: 0, confirmed: 0, positions: positions
    });
    renderManage();
    toast("已提交审核（演示）· 审核通过后自动同步志愿北京建项。");
    e.target.reset();
    $("#pos-list").innerHTML = ""; posRow("志愿者", 4, 400);
  });

  // ---------------- 启动 ----------------
  initTheme();
  bindTabs("data-stab"); bindTabs("data-ptab");
  renderFeed(); renderFilters(); renderProjects(); renderRewards();
  renderLedger(); renderBadges(); renderVouchers(); renderRank();
  renderManage(); renderIssues(); renderInstitutions(); renderAccount(); renderCert(); updateBalance(); posRow("志愿者", 4, 400);
  showAuth();
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.id === "login-form") {
      e.preventDefault();
      if (!validEmail($("#l-email").value)) { toast("请使用校内邮箱（@ruc.edu.cn）。"); return; }
      if (!$("#l-pass").value) { toast("请输入密码。"); return; }
      loginAs({ email: $("#l-email").value.trim(), sid: "2023xxxxxx", cert: 0, org: "", job: "" });
    }
    if (f.id === "reg-form") {
      e.preventDefault();
      if (!validEmail($("#r-email").value)) { toast("仅限校内邮箱（@ruc.edu.cn）注册——一人一号。"); return; }
      if (!state.sentCode || $("#r-code").value.trim() !== state.sentCode) { toast("验证码不正确，请先点「发送验证码」。"); return; }
      if (!$("#r-sid").value.trim()) { toast("请填写学号 / 工号（实名制）。"); return; }
      if (($("#r-pass").value || "").length < 6) { toast("密码至少 6 位。"); return; }
      loginAs({ email: $("#r-email").value.trim(), sid: $("#r-sid").value.trim(), cert: 0, org: "", job: "" });
    }
    if (f.id === "cert-form") {
      e.preventDefault();
      var u = state.user;
      u.org = $("#c-org").value.trim() || "志愿服务组织";
      u.job = $("#c-job").value.trim() || "项目负责人";
      u.cert = 1;
      renderCert(); renderAccount();
      toast("认证申请已提交 · 校团委备案复核中（演示）。");
      setTimeout(function () {
        if (!state.user) return;
        state.user.cert = 2; renderCert(); renderAccount();
        toast("发布者认证通过 ✓ 现在可以发布项目了。");
      }, 1500);
    }
  });
  console.log("RUCDAO v0.3 · 校内邮箱认证 + 发布者认证 · PoV 志愿服务贡献证明 · RUCOIN = 时数认证（1 小时 = 100 粒）");
})();
