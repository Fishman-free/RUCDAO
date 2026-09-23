/* RUCDAO v0 原型 —— 无构建、无外部依赖的演示前端
 * 数据为演示数据；米粒账本为本地状态模拟（链上存证由 contracts/RuCoin.sol 承担） */
(function () {
  "use strict";

  // ---------------- 演示数据 ----------------
  var feed = [
    { type: "task", tagline: "【任务】", title: "校园开放日活动跟拍", node: "校团委新媒体中心",
      body: ["内容：全程记录校园开放日，产出精修图 20 张 + 1 分钟花絮。", "要求：有相机，按时交付，素材授权校方使用。", "投稿：站内上传，负责人 3 日内验收。"],
      reward: 500, slots: 1, field: "技能" },
    { type: "task", tagline: "【任务】", title: "“我最难忘的一次志愿服务”图文征集", node: "信息学院志愿服务部",
      body: ["内容：千字以内图文一则，记录真实志愿故事。", "要求：原创，可在广场连载。", "投稿：站内发布 #志愿故事 话题。"],
      reward: 200, slots: 10, field: "技能" },
    { type: "proj", tagline: "【招募】", title: "“科技走入乡村”龙潭村数字夏令营", node: "RUCDAO × 乡建DAO 联合节点",
      body: ["岗位清单：授课志愿者 6 人（800 粒/人）、摄影记录 1 人（500 粒）、课程助教 2 人（600 粒）。", "多劳多得：额外产出村史小程序需求文档另计 300 粒。", "志愿北京时长按实际服务如实录入（预计 24h/人）。"],
      reward: 800, slots: 9, field: "乡村" },
    { type: "proj", tagline: "【长期】", title: "银龄数字课堂 · 教老人用智能手机", node: "青志协助老服务队",
      body: ["每周六上午，社区党群服务中心。", "每期 2 小时 × 1.2 系数 = 240 粒/期，长期参与满 8 期点亮「银龄之友」徽章。"],
      reward: 240, slots: 4, field: "助老" },
    { type: "task", tagline: "【任务】", title: "志愿市集摊位海报设计", node: "校志协宣传部",
      body: ["内容：A2 海报 1 张 + 朋友圈版式 1 套。", "要求：含 RUCDAO 米粒元素，可延展。", "投稿：源文件打包上传。"],
      reward: 300, slots: 2, field: "技能" },
    { type: "proj", tagline: "【活动】", title: "共学共创工作坊 #04：AI 也能做志愿项目管理", node: "信息学院志愿服务部",
      body: ["10 月 18 日 19:00，信息楼报告厅。", "米粒支付：报名费 50 粒（到场全额返还 + 赠 30 粒），产出可申领任务赏金。"],
      reward: 30, slots: 60, field: "技能" }
  ];

  var projects = [
    { title: "电脑义诊 · 教工社区站", field: "技能", node: "信息学院志愿服务部", place: "校内 · 教工社区", time: "10.26 周六 14:00", slots: "8 岗 · 剩 3", hours: 4, ratio: 1.5 },
    { title: "校园垃圾分类督导", field: "环保", node: "环境学院青志协", place: "校内 · 六大宿舍区", time: "每周三 17:30", slots: "12 岗 · 剩 6", hours: 2, ratio: 1 },
    { title: "社区数字支教（编程启蒙）", field: "支教", node: "RUCDAO 支教节点", place: "海淀区 · 定慧里社区", time: "每周日 09:30", slots: "6 岗 · 剩 2", hours: 3, ratio: 1.5 },
    { title: "129 合唱展演志愿服务", field: "赛会", node: "校学生会", place: "校内 · 如论讲堂", time: "12.08 全天", slots: "30 岗 · 剩 30", hours: 6, ratio: 1 },
    { title: "乡村振兴调研助理（龙潭村）", field: "乡村", node: "RUCDAO × 乡建DAO", place: "福建屏南 · 熙岭乡", time: "寒假 7 天", slots: "10 岗 · 剩 10", hours: 56, ratio: 2 },
    { title: "图书馆古籍数字化助理", field: "技能", node: "图书馆", place: "校内 · 图书馆古籍部", time: "每周二 14:00", slots: "4 岗 · 剩 1", hours: 3, ratio: 1.5 },
    { title: "导盲犬基地助盲行动", field: "助老", node: "青志协助残服务队", place: "昌平 · 导盲犬基地", time: "11.02 周日", slots: "15 岗 · 剩 9", hours: 5, ratio: 1.2 },
    { title: "校运会赛事志愿服务", field: "赛会", node: "体育部", place: "校内 · 田径场", time: "10.31—11.01", slots: "40 岗 · 剩 22", hours: 8, ratio: 1 }
  ];

  var rewards = [
    { icon: "🍜", title: "食堂代金券 10 元", cost: 800, note: "东区食堂通用 · 每月限 2 张" },
    { icon: "☕", title: "精品咖啡券", cost: 600, note: "校内咖啡厅 · 中杯任选" },
    { icon: "🖨️", title: "打印券 50 页", cost: 400, note: "图书馆文印中心" },
    { icon: "🍚", title: "RUCDAO 米粒文创卫衣", cost: 3000, note: "稻穗印章限定款 · 每学期 50 件" },
    { icon: "🚌", title: "名企参访名额", cost: 2500, note: "每学期 2 次 · 含车旅" },
    { icon: "🌱", title: "暑期乡村实践优先名额", cost: 3500, note: "龙潭村等共建村庄" },
    { icon: "🏆", title: "年度志愿之星奖杯 + 证书", cost: 5000, note: "校志协年会颁发 · 附 SBT 徽章" },
    { icon: "🎫", title: "活动经费抵扣 50 粒/次", cost: 50, note: "讲座、工作坊、出游报名费抵扣" }
  ];

  var ledger = [
    { amt: 240, txt: "银龄数字课堂 · 第 3 期（2h × 1.2）", hash: "0x7a3f…c210 · recordService #R-0412" },
    { amt: -50, txt: "共学共创工作坊 #04 报名费", hash: "0x15be…88aa · redeem #W-0007" },
    { amt: 500, txt: "【任务】新生报到跟拍验收通过", hash: "0x9d02…4f31 · award #T-0056" },
    { amt: 600, txt: "电脑义诊 · 教工社区站（4h × 1.5）", hash: "0x3c81…b7e2 · recordService #R-0388" },
    { amt: -800, txt: "兑换：食堂代金券 10 元", hash: "0x6af4…1d09 · redeem #C-0231" },
    { amt: 300, txt: "【任务】运动会海报设计赏金", hash: "0xbe07…77c4 · award #T-0049" }
  ];

  var badges = [
    { k: "★", n: "星级志愿者" }, { k: "影", n: "校园摄影" }, { k: "修", n: "硬件维修" }
  ];

  var state = { balance: 2340, filter: "全部", joined: {}, redeemed: {} };

  // ---------------- 工具 ----------------
  function $(sel) { return document.querySelector(sel); }
  function fmt(n) { return n.toLocaleString("en-US"); }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  function updateBalance() {
    $("#balance-quick").textContent = fmt(state.balance);
    $("#balance-main").textContent = fmt(state.balance);
  }

  // ---------------- 渲染 ----------------
  function renderFeed() {
    $("#feed-list").innerHTML = feed.map(function (p, i) {
      return '<article class="card">' +
        '<span class="post-type ' + (p.type === "task" ? "task" : "") + '">' + esc(p.tagline) + esc(p.field) + '</span>' +
        '<h3 class="post-title">' + esc(p.title) + '</h3>' +
        '<div class="post-body">' + p.body.map(function (b) { return "<p>" + esc(b) + "</p>"; }).join("") + '</div>' +
        '<div class="post-meta"><span>发布节点：<b>' + esc(p.node) + '</b></span>' +
        '<span>赏金/酬劳：<b>' + fmt(p.reward) + ' 粒</b></span>' +
        '<span>名额：' + p.slots + '</span>' +
        '<button class="btn btn-ghost" data-join-feed="' + i + '">接单 / 报名</button></div>' +
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
      return '<article class="card proj-card">' +
        '<span class="tag ' + esc(p.field) + '">' + esc(p.field) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="proj-meta">节点：' + esc(p.node) + '</p>' +
        '<p class="proj-meta">' + esc(p.place) + ' · ' + esc(p.time) + '</p>' +
        '<p class="proj-meta">' + esc(p.slots) + ' · ' + p.hours + ' 小时/人</p>' +
        '<div class="proj-reward"><b>' + fmt(p.hours * 100 * p.ratio) + ' 粒</b>' +
        '<button class="btn" data-join="' + idx + '"' + (joined ? " disabled" : "") + '>' + (joined ? "已报名 ✓" : "立即报名") + '</button></div>' +
        '</article>';
    }).join("") || '<p class="muted">该领域暂无项目，去广场看看悬赏任务？</p>';
  }

  function renderRewards() {
    $("#reward-grid").innerHTML = rewards.map(function (r, i) {
      return '<article class="card reward-card">' +
        '<span class="reward-icon" aria-hidden="true" style="font-size:34px;line-height:46px">' + r.icon + '</span>' +
        '<h3 style="font-family:var(--serif);margin:0 0 4px">' + esc(r.title) + '</h3>' +
        '<p class="muted">' + esc(r.note) + '</p>' +
        '<p class="reward-cost">' + fmt(r.cost) + ' 粒</p>' +
        '<button class="btn" data-buy="' + i + '"' + (state.redeemed[i] ? " disabled" : "") + '>' + (state.redeemed[i] ? "已兑换 ✓" : "兑换") + '</button>' +
        '</article>';
    }).join("");
  }

  function renderLedger() {
    $("#ledger").innerHTML = ledger.map(function (l) {
      return '<div class="ledger-row"><span>' + esc(l.txt) + '<span class="ledger-hash">' + esc(l.hash) + '</span></span>' +
        '<span class="ledger-amt ' + (l.amt > 0 ? "plus" : "minus") + '">' + (l.amt > 0 ? "+" : "") + fmt(l.amt) + ' 粒</span></div>';
    }).join("");
    $("#badges").innerHTML = badges.map(function (b) {
      return '<div class="badge-seal"><b>' + esc(b.k) + '</b>' + esc(b.n) + '</div>';
    }).join("");
  }

  // ---------------- 交互 ----------------
  function switchTab(name) {
    document.querySelectorAll(".nav-btn").forEach(function (b) {
      var on = b.dataset.tab === name;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".tab").forEach(function (s) {
      s.classList.toggle("active", s.id === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-btn").forEach(function (b, i, all) {
    b.addEventListener("click", function () { switchTab(b.dataset.tab); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); var n = all[(i + d + all.length) % all.length]; n.focus(); switchTab(n.dataset.tab); }
    });
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;

    if (t.dataset.goto) { switchTab(t.dataset.goto); }
    if (t.dataset.filter) { state.filter = t.dataset.filter; renderFilters(); renderProjects(); }
    if (t.dataset.join !== undefined && !state.joined[t.dataset.join]) {
      state.joined[t.dataset.join] = true; renderProjects();
      toast("报名成功 ✓ 项目负责人确认后生成服务记录，时长将录入志愿北京。");
    }
    if (t.dataset.joinFeed !== undefined) {
      toast("已接单 ✓ 完成后在「我的」提交交付物，验收通过即发米粒。");
    }
    if (t.dataset.buy !== undefined && !state.redeemed[t.dataset.buy]) {
      var r = rewards[+t.dataset.buy];
      if (state.balance < r.cost) { toast("米粒不足——去项目库接个项目吧。"); return; }
      state.redeemed[t.dataset.buy] = true;
      state.balance -= r.cost;
      ledger.unshift({ amt: -r.cost, txt: "兑换：" + r.title, hash: "0x" + Math.random().toString(16).slice(2, 6) + "…演示 · redeem" });
      updateBalance(); renderRewards(); renderLedger();
      toast("兑换成功（演示）· 凭码到志协办公室核销。");
    }
    if (t.id === "wallet-btn" || t.id === "wallet-btn-2") { connectWallet(); }
  });

  async function connectWallet() {
    if (window.ethereum && window.ethereum.request) {
      try {
        var accts = await window.ethereum.request({ method: "eth_requestAccounts" });
        var msg = "RUCDAO 钱包绑定（测试网演示）\n学号: 2023xxxxxx\n地址: " + accts[0];
        await window.ethereum.request({ method: "personal_sign", params: [msg, accts[0]] });
        var short = accts[0].slice(0, 6) + "…" + accts[0].slice(-4);
        $("#wallet-btn").textContent = short;
        $("#wallet-state").innerHTML = "已绑定自有钱包 <b>" + short + "</b>（签名验证通过）。米粒为灵魂绑定凭证，不可转账。";
        toast("钱包绑定成功 ✓ 签名已验证。");
      } catch (err) { toast("已取消绑定。托管钱包（学号即账户）继续可用。"); }
    } else {
      toast("未检测到 MetaMask —— 已用托管钱包（学号即账户）进入演示模式。");
    }
  }

  // 发布表单：米粒预估
  var ratioSel = $("#p-ratio"), hoursIn = $("#p-hours"), slotsIn = $("#p-slots");
  function preview() {
    $("#p-preview").textContent = fmt((+hoursIn.value || 0) * 100 * (+ratioSel.value || 1));
  }
  [ratioSel, hoursIn, slotsIn].forEach(function (el) { el.addEventListener("input", preview); });
  $("#publish-form").addEventListener("submit", function (e) {
    e.preventDefault();
    toast("已提交审核（演示）· 审核通过后自动同步志愿北京建项。");
    e.target.reset(); preview();
  });

  // ---------------- 启动 ----------------
  renderFeed(); renderFilters(); renderProjects(); renderRewards(); renderLedger(); updateBalance(); preview();
  console.log("RUCDAO v0 原型已启动 · 米粒不可转让、不可兑换现金 · github.com/Fishman-free/RUCDAO");
})();
