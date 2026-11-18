/* Animated figures for EVA and WEVA. No dependencies.
   Usage: <div class="anim" data-anim="eva"></div>  (or "weva", or "both")
   Each figure is a sequence of frames; a frame is a full description of
   what is visible, and any frame can be shown directly. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function cls(e, name, on) { e.classList.toggle(name, !!on); }
  function arrow(svg, x1, y1, x2, y2) {
    var line = el("line", { class: "a-arrow", x1: x1, y1: y1, x2: x2, y2: y2 }, svg);
    var d = x2 > x1 ? 1 : -1;
    var head = el("path", { class: "a-head", d: "M" + x2 + " " + y2 + " l" + (-7 * d) + " -4 v8 z" }, svg);
    return { on: function (v) { cls(line, "on", v); cls(head, "on", v); } };
  }
  function panel(svg, x, y, w, h, title) {
    var r = el("rect", { class: "a-panel", x: x, y: y, width: w, height: h, rx: 10 }, svg);
    el("text", { class: "a-title", x: x + 14, y: y + 23 }, svg, title);
    return r;
  }
  function taskBar(svg) {
    el("rect", { class: "a-task", x: 12, y: -2, width: 936, height: 32, rx: 8 }, svg);
    el("text", { class: "a-title", x: 26, y: 18 }, svg, "Task");
    var t = el("text", { class: "a-tasktext", x: 70, y: 18 }, svg, "");
    var n = el("text", { class: "a-sub", x: 934, y: 18, "text-anchor": "end" }, svg, "");
    return function (text, num) { t.textContent = text || ""; n.textContent = num || ""; };
  }
  function chip(svg, x, y, w, label, extra) {
    var g = el("g", { class: "a-chip" + (extra ? " " + extra : "") }, svg);
    el("rect", { x: x, y: y, width: w, height: 18, rx: 4 }, g);
    el("text", { x: x + w / 2, y: y + 12.5, "text-anchor": "middle" }, g, label);
    return g;
  }

  function setVal(t, v) {
    v = v || ""; t.textContent = v.replace(/^[!+~=]/, ""); cls(t, "ok", v.charAt(0) === "=");
    cls(t, "new", v.charAt(0) === "+"); cls(t, "bad", v.charAt(0) === "!"); cls(t, "reuse", v.charAt(0) === "~");
  }
  function chipSet(svg, x, y, names) {
    var out = {};
    names.forEach(function (n, i) { out[n[0]] = chip(svg, x, y + i * 21, 92, n[0], n[1]); });
    return out;
  }

  /* ------------------------------------------------------------------
     EVA: trajectory -> Perceptor -> quasi-symbolic abstraction -> memory
     Follows Sections 2.1 to 2.3 of the EVA paper and its WebShop example.
     ------------------------------------------------------------------ */
  function buildEva(svg) {
    var setTask = taskBar(svg);
    var pTraj = panel(svg, 12, 40, 236, 190, "Actions and feedback");
    var pAbs = panel(svg, 364, 40, 300, 190, "Active abstraction");
    var pMem = panel(svg, 676, 40, 272, 190, "Memory");
    var conf = el("text", { class: "a-sub", x: 650, y: 63, "text-anchor": "end" }, svg, "");
    el("text", { class: "a-sub", x: 934, y: 63, "text-anchor": "end" }, svg, "utility");

    var a1 = arrow(svg, 250, 75, 258, 75), a2 = arrow(svg, 354, 75, 362, 75);
    var aBack = arrow(svg, 258, 97, 250, 97), a3 = arrow(svg, 666, 110, 674, 110), aRet = arrow(svg, 674, 150, 666, 150);
    var mod = el("rect", { class: "a-mod", x: 260, y: 52, width: 92, height: 58, rx: 8 }, svg);
    var modName = el("text", { class: "a-modname", x: 306, y: 85, "text-anchor": "middle" }, svg, "");
    var chips = chipSet(svg, 260, 122, [["ACT"], ["ABSTRACT", "amber"], ["RETRIEVE"], ["ROLLBACK", "alert"]]);

    var goal = el("text", { class: "a-val", x: 26, y: 86 }, svg, "");
    var steps = [0, 1, 2, 3].map(function (i) { return el("text", { class: "a-val a-mono", x: 26, y: 112 + i * 21 }, svg, ""); });
    var res = el("text", { class: "a-val", x: 26, y: 210 }, svg, "");

    var keys = [["V", 88], ["T", 116], ["C", 144], ["E", 200]], vals = {};
    keys.forEach(function (k) { el("text", { class: "a-rowlab", x: 378, y: k[1] }, svg, k[0]); vals[k[0]] = el("text", { class: "a-val", x: 398, y: k[1] }, svg, ""); });
    vals.C2 = el("text", { class: "a-val", x: 398, y: 162 }, svg, "");

    var ents = [0, 1, 2].map(function (i) {
      var y = 74 + i * 50, g = el("g", { class: "a-entry" }, svg), o = { g: g };
      o.box = el("rect", { class: "a-box", x: 690, y: y, width: 244, height: 42, rx: 6 }, g);
      o.title = el("text", { class: "a-btext", x: 702, y: y + 17 }, g, "");
      o.tag = el("text", { class: "a-tag", x: 702, y: y + 33 }, g, "");
      el("rect", { class: "a-track", x: 852, y: y + 26, width: 70, height: 7, rx: 3 }, g);
      o.util = el("rect", { class: "a-meter", x: 852, y: y + 26, width: 0, height: 7, rx: 3 }, g);
      o.fs = ["V", "T", "C", "E"].map(function (k, n) {
        var c = el("g", { class: "a-fchip" }, g);
        el("rect", { x: 768 + n * 17, y: y + 23, width: 14, height: 12, rx: 3 }, c);
        el("text", { x: 775 + n * 17, y: y + 32, "text-anchor": "middle" }, c, k);
        return { g: c, k: k };
      });
      return o;
    });

    return function render(f) {
      cls(pTraj, "on", f.hi === "traj"); cls(pTraj, "warn", f.hi === "fail");
      cls(pAbs, "on", f.hi === "abs"); cls(pMem, "on", f.hi === "mem");
      modName.textContent = f.mod || ""; cls(mod, "on", !!f.mod);
      for (var k in chips) cls(chips[k], "on", f.meta === k);
      a1.on(has(f, "a1")); a2.on(has(f, "a2")); aBack.on(has(f, "back")); a3.on(has(f, "a3")); aRet.on(has(f, "ret"));
      var tk = TASKS[f.goal] || [];
      if (tk[0]) setTask(tk[0], tk[1]); goal.textContent = "environment: WebShop";
      steps.forEach(function (t, i) { setVal(t, (f.steps || [])[i]); });
      setVal(res, f.res);
      conf.textContent = f.conf ? "confidence " + f.conf : "";
      ["V", "T", "C", "C2", "E"].forEach(function (k) { setVal(vals[k], (f.A || {})[k]); });
      ents.forEach(function (o, i) {
        var e = (f.mem || [])[i];
        cls(o.g, "a-hide", !e); if (!e) return;
        o.title.textContent = e.title; o.tag.textContent = e.tag;
        cls(o.tag, "bad", e.tag === "FAILURE"); cls(o.box, "best", !!e.hi); cls(o.g, "dim", !!e.fade); cls(o.g, "fly", !!e.hi);
        o.fs.forEach(function (c) { cls(c.g, "a-hide", (e.fields || "VTCE").indexOf(c.k) < 0); cls(c.g, "amber", e.tag === "FAILURE"); });
        o.util.setAttribute("width", 70 * e.util); cls(o.util, "low", e.util < 0.3);
      });
    };
  }
  function has(f, n) { return (f.arr || []).indexOf(n) >= 0; }

  var OLD = { title: "navigation shortcut", tag: "SUCCESS", util: 0.22 };
  var PROC = { title: "product selection procedure", tag: "SUCCESS", util: 0.5 };
  var AVOID = { title: "option required before purchase", tag: "FAILURE", util: 0.4, fields: "C" };
  var TASKS = {};
  var G1 = "goal: find grocery cookies", G2 = "goal: find grocery crackers", G3 = "goal: find a mug, colour blue";
  TASKS[G1] = ["\u201cI need grocery cookies. Find a product that matches and buy it.\u201d", "task 1 of 3"];
  TASKS[G2] = ["\u201cI need grocery crackers. Find a product that matches and buy it.\u201d", "task 2 of 3"];
  TASKS[G3] = ["\u201cI need a mug in blue. Find it, select the colour and buy it.\u201d", "task 3 of 3"];
  var A_FULL = { V: "product, category, price, options", T: "search, inspect, open page, verify, buy", C: "buy only when every requirement is checked", E: "progress 3 of 4, no contradiction" };
  var EVA = [
    { cap: "A task arrives. The agent searches the shop and opens a candidate product. At this stage the experience is a raw trajectory of observations, actions and feedback.",
      goal: G1, hi: "traj", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]"], mem: [OLD], arr: [] },
    { cap: "<b>Perceptor.</b> The trajectory is mapped into a quasi-symbolic abstraction. The entities (V) and the transitions (T) keep the role each element plays, and the product-specific wording is left out.",
      goal: G1, mod: "Perceptor", hi: "abs", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]"],
      A: { V: "+product, category, price, options", T: "+search, inspect, open page, verify, buy" }, mem: [OLD], arr: ["a1", "a2"] },
    { cap: "<b>Perceptor.</b> Constraints (C) record what has to hold before an action, and outcomes (E) record progress. The Perceptor also reports how confident it is in the abstraction.",
      goal: G1, mod: "Perceptor", hi: "abs", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]", "verify category, price, options"],
      A: { V: A_FULL.V, T: A_FULL.T, C: "+" + A_FULL.C, E: "+" + A_FULL.E }, conf: "0.86", mem: [OLD], arr: ["a1", "a2"] },
    { cap: "<b>Controller.</b> The Controller reads a compact summary of the abstraction (confidence, contradictions, novelty and progress) and selects a meta-action. Here the state is reliable, and the Actor proceeds.",
      goal: G1, mod: "Controller", meta: "ACT", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]", "verify category, price, options"], A: A_FULL, conf: "0.86", mem: [OLD], arr: ["back"] },
    { cap: "<b>Actor.</b> The action is conditioned on the abstraction. Every requirement has been checked, and the purchase is verified as a success.",
      goal: G1, mod: "Actor", meta: "ACT", hi: "traj", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]", "verify category, price, options", "click[Buy Now]"], res: "=verified success", A: A_FULL, conf: "0.86", mem: [OLD], arr: ["a1"] },
    { cap: "<b>Into memory.</b> After a verified success the abstraction is stored with a link to its trajectory and a SUCCESS label. What is kept is the search, verify and purchase procedure, without the wording of this product.",
      goal: G1, hi: "mem", steps: ["search[grocery cookies]", "click[Walkers Shortbread Tin]", "verify category, price, options", "click[Buy Now]"], res: "=verified success", A: A_FULL,
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.5, hi: 1 }], arr: ["a3"] },
    { cap: "<b>Retrieve.</b> A new request arrives. The Controller queries memory, and stored abstractions are matched by structure, field by field. The procedure is bound to the new entities and guides the Actor.",
      goal: G2, mod: "Controller", meta: "RETRIEVE", hi: "abs", steps: ["~search[grocery crackers]", "~open the most relevant page", "~verify category, price, options"],
      A: { V: "~product, category: crackers, price", T: "~" + A_FULL.T, C: "~" + A_FULL.C, E: "progress 2 of 4" },
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.5, hi: 1 }], arr: ["ret", "back"] },
    { cap: "The reuse ends in a success, and the utility of the stored procedure increases. Each abstraction keeps a record of how often its reuse helped.",
      goal: G2, mod: "Actor", meta: "ACT", hi: "mem", steps: ["~search[grocery crackers]", "~open the most relevant page", "~verify category, price, options", "~click[Buy Now]"], res: "=verified success",
      A: { V: "product, category: crackers, price", T: A_FULL.T, C: A_FULL.C, E: "progress 4 of 4" },
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.82, hi: 1 }], arr: ["a3"] },
    { cap: "On a later task an action fails. The shop rejects the purchase because a required option was never selected, and the feedback identifies the action that caused it.",
      goal: G3, mod: "Actor", hi: "fail", steps: ["~search[mug]", "~open the most relevant page", "!click[Buy Now]"], res: "!rejected: colour not selected",
      A: { V: "product, category: mug, colour", T: A_FULL.T, C: A_FULL.C, E: "!contradiction on C" }, conf: "0.41",
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.82 }], arr: ["a1"] },
    { cap: "<b>Rollback, then abstract.</b> The Controller restores the last consistent abstraction. Actions already executed are not undone. The Perceptor rebuilds the state over a longer window, and the localised failure becomes a constraint on what to avoid.",
      goal: G3, mod: "Controller", meta: "ROLLBACK", hi: "abs", steps: ["~search[mug]", "~open the most relevant page"],
      A: { V: "product, category: mug, colour", T: A_FULL.T, C: A_FULL.C, C2: "+avoid: buy while an option is unselected", E: "progress 2 of 4" }, conf: "0.78",
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.82 }], arr: ["back", "a2"] },
    { cap: "<b>Into memory.</b> The instructive failure is stored with a FAILURE label. When it is retrieved later, it contributes a constraint, while successful abstractions contribute reusable transitions.",
      goal: G3, mod: "Actor", meta: "ACT", hi: "mem", steps: ["~search[mug]", "~open the most relevant page", "select[colour: blue]", "click[Buy Now]"], res: "=verified success",
      A: { V: "product, category: mug, colour", T: A_FULL.T, C: A_FULL.C, C2: "avoid: buy while an option is unselected", E: "progress 4 of 4" },
      mem: [OLD, { title: PROC.title, tag: "SUCCESS", util: 0.82 }, { title: AVOID.title, tag: "FAILURE", util: 0.4, hi: 1 }], arr: ["a3"] },
    { cap: "<b>Forgetting.</b> Entries whose reuse stops helping lose utility over time and are pruned. Memory keeps the abstractions that continue to support later decisions.",
      goal: "", hi: "mem", steps: [], A: {},
      mem: [{ title: OLD.title, tag: "SUCCESS", util: 0.08, fade: 1 }, { title: PROC.title, tag: "SUCCESS", util: 0.82 }, { title: AVOID.title, tag: "FAILURE", util: 0.4 }], arr: [] }
  ];

  /* ------------------------------------------------------------------
     WEVA: current state -> candidates -> predicted states -> check -> act
     Follows Sections 2.4 to 2.6 of the WEVA paper (verified lookahead,
     world-model correction, model trust).
     ------------------------------------------------------------------ */
  function buildWeva(svg) {
    taskBar(svg)("\u201cBook me a flight from Rome to Edinburgh. My return flight is already booked.\u201d", "flight booking");
    var pState = panel(svg, 12, 40, 236, 190, "Current state σ");
    var pFut = panel(svg, 362, 40, 370, 190, "Verified lookahead");
    var pEnv = panel(svg, 744, 40, 204, 190, "Environment");
    var heads = [["candidate action", 374], ["predicted (not executed)", 498], ["check", 650]].map(function (h) {
      return el("text", { class: "a-sub a-head2", x: h[1], y: 80 }, svg, h[0]);
    });

    [["V", 88], ["C", 122], ["E", 200]].forEach(function (l) { el("text", { class: "a-rowlab", x: 26, y: l[1] }, svg, l[0]); });
    var vals = { V: el("text", { class: "a-val", x: 46, y: 88 }, svg, ""), C: el("text", { class: "a-val", x: 46, y: 122 }, svg, ""),
      C2: el("text", { class: "a-val", x: 46, y: 140 }, svg, ""), E: el("text", { class: "a-val", x: 46, y: 200 }, svg, "") };

    var a1 = arrow(svg, 250, 75, 256, 75), a2 = arrow(svg, 352, 75, 360, 75), a3 = arrow(svg, 734, 125, 742, 125);
    var aBack = arrow(svg, 256, 97, 250, 97);
    var mod = el("rect", { class: "a-mod", x: 258, y: 52, width: 92, height: 58, rx: 8 }, svg);
    var modName = el("text", { class: "a-modname", x: 304, y: 85, "text-anchor": "middle" }, svg, "");
    var chips = chipSet(svg, 258, 120, [["LOOKAHEAD"], ["ACT"], ["ABSTRACT", "amber"], ["RETRIEVE"], ["ROLLBACK", "alert"]]);

    var br = [92, 136, 180].map(function (y) {
      var o = {};
      o.cand = el("rect", { class: "a-box", x: 374, y: y, width: 112, height: 30, rx: 5 }, svg);
      o.ct = el("text", { class: "a-btext", x: 430, y: y + 19, "text-anchor": "middle" }, svg, "");
      o.l2 = el("line", { class: "a-br", x1: 486, y1: y + 15, x2: 498, y2: y + 15 }, svg);
      o.pred = el("rect", { class: "a-box pred", x: 498, y: y, width: 142, height: 30, rx: 5 }, svg);
      o.pt = el("text", { class: "a-btext", x: 569, y: y + 19, "text-anchor": "middle" }, svg, "");
      o.mark = el("text", { class: "a-mark", x: 650, y: y + 19 }, svg, "");
      return o;
    });

    var banner = el("rect", { class: "a-banner", x: 756, y: 72, width: 180, height: 22, rx: 4 }, svg);
    var bannerT = el("text", { class: "a-bannertext", x: 846, y: 87, "text-anchor": "middle" }, svg, "");
    var envA = el("text", { class: "a-val", x: 756, y: 116 }, svg, ""), envR = el("text", { class: "a-val", x: 756, y: 136 }, svg, ""), envM = el("text", { class: "a-val", x: 756, y: 156 }, svg, "");
    el("text", { class: "a-sub", x: 756, y: 192 }, svg, "model trust μ");
    el("rect", { class: "a-track", x: 756, y: 200, width: 180, height: 10, rx: 3 }, svg);
    var meter = el("rect", { class: "a-meter", x: 756, y: 200, width: 0, height: 10, rx: 3 }, svg);
    el("line", { class: "a-alert", x1: 837, y1: 195, x2: 837, y2: 215 }, svg);
    el("text", { class: "a-alerttext", x: 936, y: 192, "text-anchor": "end" }, svg, "alert level");

    return function render(f) {
      cls(pState, "on", f.hi === "state"); cls(pFut, "on", f.hi === "fut");
      cls(pEnv, "on", f.hi === "env"); cls(pEnv, "warn", f.hi === "envfail");
      modName.textContent = f.mod || ""; cls(mod, "on", !!f.mod);
      for (var k in chips) cls(chips[k], "on", f.meta === k);
      a1.on(has(f, "a1")); a2.on(has(f, "a2")); a3.on(has(f, "a3")); aBack.on(has(f, "back"));
      ["V", "C", "C2", "E"].forEach(function (k) { setVal(vals[k], f.state[k]); });
      var anyPred = false, anyChk = false;
      br.forEach(function (o, i) {
        var b = f.br[i];
        ["cand", "ct"].forEach(function (p) { cls(o[p], "a-hide", !b); });
        ["l2", "pred", "pt"].forEach(function (p) { cls(o[p], "a-hide", !b || !b.pred); });
        cls(o.mark, "a-hide", !b || !b.st);
        if (!b) return;
        if (b.pred) anyPred = true; if (b.st) anyChk = true;
        o.ct.textContent = b.cand; o.pt.textContent = b.pred || "";
        var st = b.st || "";
        cls(o.pred, "bad", st === "bad"); cls(o.l2, "bad", st === "bad");
        ["cand", "pred", "l2"].forEach(function (p) { cls(o[p], "best", st === "best"); });
        ["cand", "ct"].forEach(function (p) { cls(o[p], "dim", st === "bad" || st === "dim"); });
        ["pred", "pt"].forEach(function (p) { cls(o[p], "dim", st === "dim"); });
        o.mark.textContent = st === "bad" ? "× pruned" : st === "best" ? (b.done ? "✓ executed" : "✓ consistent") : st === "dim" ? "no progress" : st === "ok" ? "✓ consistent" : "";
        cls(o.mark, "bad", st === "bad"); cls(o.mark, "best", st === "best" || st === "ok");
      });
      cls(heads[0], "a-hide", !f.br.some(Boolean)); cls(heads[1], "a-hide", !anyPred); cls(heads[2], "a-hide", !anyChk);
      cls(banner, "a-hide", !f.banner); bannerT.textContent = f.banner || "";
      envA.textContent = f.envA || ""; envR.textContent = f.envR || ""; setVal(envM, f.envM);
      meter.setAttribute("width", 180 * f.trust); cls(meter, "low", f.trust < 0.45);
    };
  }

  var S0 = { V: "outbound open, return booked", C: "return booking stays unchanged", E: "progress 0 of 2" };
  var S1 = { V: "outbound booked, return booked", C: "return booking stays unchanged", E: "progress 1 of 2" };
  var C1 = "rebook the return", C2 = "finish the task", C3 = "book the outbound";
  var P1 = "return booking changed", P2 = "task closed, 0 of 2", P3 = "outbound booked, 1 of 2";
  var WEVA = [
    { cap: "<b>Perceptor.</b> The request is to book an outbound flight, with the return already booked. WEVA starts from the current state, which keeps the entities (V), the active preconditions (C) and the progress signals (E).",
      mod: "Perceptor", hi: "state", state: S0, br: [], trust: 0.82, arr: ["a1"] },
    { cap: "<b>Actor.</b> A few candidate actions are proposed and ranked by expected progress. None of them is executed yet.",
      mod: "Actor", meta: "LOOKAHEAD", hi: "fut", state: S0, br: [{ cand: C1 }, { cand: C2 }, { cand: C3 }], trust: 0.82, arr: ["a2"] },
    { cap: "<b>World model.</b> For each candidate, the learned transition model predicts the state that would follow.",
      mod: "World model", meta: "LOOKAHEAD", hi: "fut", state: S0, br: [{ cand: C1, pred: P1 }, { cand: C2, pred: P2 }, { cand: C3, pred: P3 }], trust: 0.82, arr: ["a2"] },
    { cap: "<b>Check.</b> Each predicted transition is compared with the active preconditions. Rebooking the return would change a booking that has to stay untouched, which breaks C, and the branch is pruned before the action reaches the environment.",
      mod: "World model", meta: "LOOKAHEAD", hi: "fut", state: S0, br: [{ cand: C1, pred: P1, st: "bad" }, { cand: C2, pred: P2, st: "dim" }, { cand: C3, pred: P3, st: "ok" }], trust: 0.82, arr: ["back"] },
    { cap: "<b>Act.</b> Among the consistent branches, the one with the highest predicted progress is selected, and only its first action is executed.",
      mod: "Actor", meta: "ACT", hi: "env", state: S0, br: [{ cand: C1, pred: P1, st: "bad" }, { cand: C2, pred: P2, st: "dim" }, { cand: C3, pred: P3, st: "best", done: 1 }], envA: "executed: book the outbound", trust: 0.82, arr: ["a3"] },
    { cap: "<b>Compare.</b> The observed state matches the prediction. Model trust, the agreement between predicted and observed states over recent steps, stays high, and lookahead remains in use.",
      mod: "Controller", meta: "LOOKAHEAD", hi: "env", state: S1, br: [{ cand: C1, pred: P1, st: "bad" }, { cand: C2, pred: P2, st: "dim" }, { cand: C3, pred: P3, st: "best", done: 1 }],
      envA: "executed: book the outbound", envR: "observed: outbound booked", envM: "=matches the prediction", trust: 0.9, arr: ["back"] },
    { cap: "The environment changes without notice. Predictions stop matching what is observed, and model trust falls below its alert level before task success has degraded. The Controller relies less on lookahead.",
      mod: "Controller", meta: "ACT", hi: "envfail", state: S1, br: [null, { cand: "pay for the flight", pred: "booking confirmed, 2 of 2", st: "best", done: 1 }, null],
      banner: "the booking site has changed", envA: "executed: pay for the flight", envR: "observed: payment blocked", envM: "!differs from the prediction", trust: 0.36, arr: ["a3"] },
    { cap: "<b>Abstract and correct.</b> Under a sustained decline the Controller rebuilds the state over a broader window. A mismatch that recurs under the same action becomes a candidate precondition, and it is admitted when it rejects an observed failure without contradicting an earlier success.",
      mod: "Controller", meta: "ABSTRACT", hi: "state", state: { V: S1.V, C: S1.C, C2: "+seat chosen before payment", E: S1.E }, br: [],
      banner: "the booking site has changed", envR: "state rebuilt", envM: "precondition revised", trust: 0.62, arr: ["back", "a1"] }
  ];

  var SCENES = {
    eva: { build: buildEva, frames: EVA, label: "EVA: from a trajectory to memory",
      legend: [["keep", "reused from memory"], ["amber", "newly written"], ["fail", "failure"], ["pass", "selected entry"]] },
    weva: { build: buildWeva, frames: WEVA, label: "WEVA: predict, check, then act",
      legend: [["pass", "consistent branch"], ["fail", "predicted violation, pruned"], ["amber", "revised precondition"]] }
  };

  function mount(host, key, autoplay) {
    var sc = SCENES[key];
    var wrap = document.createElement("div"); host.appendChild(wrap);
    var svg = el("svg", { viewBox: "0 -8 960 250", role: "img", "aria-label": sc.label }, null);
    wrap.appendChild(svg);
    var render = sc.build(svg);
    var cap = document.createElement("p"); cap.className = "anim__cap"; cap.setAttribute("aria-live", "polite"); wrap.appendChild(cap);
    var bar = document.createElement("div"); bar.className = "anim__bar"; wrap.appendChild(bar);
    function btn(label) { var b = document.createElement("button"); b.type = "button"; b.className = "anim__btn"; b.textContent = label; bar.appendChild(b); return b; }
    var prev = btn("Previous"), play = btn("Pause"), next = btn("Next");
    var dots = document.createElement("div"); dots.className = "anim__dots"; bar.appendChild(dots);
    var dotEls = sc.frames.map(function (f, i) {
      var d = document.createElement("button"); d.type = "button"; d.className = "anim__dot"; d.setAttribute("aria-label", "Step " + (i + 1));
      d.addEventListener("click", function () { stop(); show(i); }); dots.appendChild(d); return d;
    });
    var leg = document.createElement("ul"); leg.className = "anim__legend";
    leg.innerHTML = sc.legend.map(function (l) { return '<li><i class="' + l[0] + '"></i>' + l[1] + "</li>"; }).join("");
    wrap.appendChild(leg);

    var idx = 0, timer = null, playing = false, visible = false;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(i) {
      idx = (i + sc.frames.length) % sc.frames.length;
      var f = sc.frames[idx];
      render(f); cap.innerHTML = f.cap;
      dotEls.forEach(function (d, k) { d.classList.toggle("on", k === idx); });
    }
    function tick() { show(idx + 1); schedule(); }
    function schedule() { clearTimeout(timer); if (playing && visible) timer = setTimeout(tick, idx === sc.frames.length - 1 ? 3600 : 1900); }
    function start() { playing = true; play.textContent = "Pause"; schedule(); }
    function stop() { playing = false; play.textContent = "Play"; clearTimeout(timer); }
    prev.addEventListener("click", function () { stop(); show(idx - 1); });
    next.addEventListener("click", function () { stop(); show(idx + 1); });
    play.addEventListener("click", function () { if (playing) stop(); else start(); });
    var first = parseInt(host.getAttribute("data-frame") || "0", 10) || 0;
    show(first);
    if (reduce || !autoplay || host.hasAttribute("data-frame")) stop(); else start();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(wrap);
    } else { visible = true; schedule(); }
    return { wrap: wrap, stop: stop, show: show };
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-anim]"), function (host) {
    var key = host.getAttribute("data-anim");
    if (key !== "both") { mount(host, key, true); return; }
    var tabs = document.createElement("div"); tabs.className = "anim__tabs"; host.appendChild(tabs);
    var views = {};
    ["eva", "weva"].forEach(function (k, i) {
      var t = document.createElement("button"); t.type = "button"; t.className = "anim__tab" + (i === 0 ? " on" : ""); t.textContent = SCENES[k].label;
      tabs.appendChild(t);
      views[k] = mount(host, k, true); views[k].wrap.hidden = i !== 0; views[k].tab = t;
      t.addEventListener("click", function () {
        for (var o in views) { views[o].wrap.hidden = o !== k; views[o].tab.classList.toggle("on", o === k); }
        views[k].show(0);
      });
    });
  });
})();
