/* Adaptive Reasoning Agency: page behaviour, paper registry and charts.
   No dependencies. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     PAPERS. Paste each link into `url`. Entries with an empty url are
     rendered as plain text, so the page never shows a dead link.
     ------------------------------------------------------------------ */
  var PAPERS = {
    align:      { title: "Aligning large and small language models via chain-of-thought reasoning", authors: "Ranaldi and Freitas", venue: "EACL 2024", url: "https://aclanthology.org/2024.eacl-long.109.pdf" },
    selfrefine: { title: "Self-refine instruction-tuning for aligning reasoning in language models", authors: "Ranaldi and Freitas", venue: "EMNLP 2024", url: "https://aclanthology.org/2024.emnlp-main.139.pdf" },
    icl:        { title: "When natural language is not enough: the limits of in-context learning demonstrations in multilingual reasoning", authors: "Ranaldi, Haddow and Birch", venue: "Findings of NAACL 2025", url: "https://aclanthology.org/2025.findings-naacl.412.pdf" },
    pal:        { title: "Empowering multi-step reasoning across languages via program-aided language models", authors: "Ranaldi, Pucci, Haddow and Birch", venue: "EMNLP 2024", url: "https://aclanthology.org/2024.emnlp-main.678.pdf" },
    quasar:     { title: "Improving chain-of-thought reasoning via quasi-symbolic abstractions", authors: "Ranaldi, Valentino and Freitas", venue: "ACL 2025", url: "https://aclanthology.org/2025.acl-long.843.pdf" },
    boethius:   { title: "Thinking in schemas: robust syllogistic reasoning in LLMs", authors: "Ranaldi, Ranaldi, Zanzotto and Cohen", venue: "ACL 2026", url: "https://aclanthology.org/2026.acl-long.1897.pdf" },
    aas:        { title: "Abstract activation spaces for content-invariant reasoning in large language models", authors: "Maraia, Valentino, Zanzotto and Ranaldi", venue: "EMNLP 2026", url: "https://aclanthology.org/2026.emnlp-main.2168.pdf" },
    sycophancy: { title: "Learning multilingual agentic policy to control sycophancy", authors: "Ranaldi and Pucci", venue: "EACL 2026", url: "https://aclanthology.org/2026.eacl-long.169.pdf" },
    dialectic:  { title: "Agentic oversight via dialectic reasoning", authors: "Ranaldi and Ranaldi", venue: "ACL 2026", url: "https://aclanthology.org/2026.acl-long.1143.pdf" },
    clinical:   { title: "Neurosymbolic clinical trial matching via LLM-driven abduction and logical verification", authors: "Qu, Ranaldi, Wang and Valentino", venue: "arXiv 2026", url: "https://arxiv.org/pdf/2606.20895" },
    eva:        { title: "Evolving agents", authors: "Ranaldi", venue: "ACL 2026", url: "https://aclanthology.org/2026.acl-long.754.pdf" },
    weva:       { title: "World-model evolving agents", authors: "Ranaldi", venue: "EMNLP 2026", url: "https://aclanthology.org/2026.emnlp-main.2167.pdf" },
    worldbench: { title: "WorldBench: culturally grounded benchmark for multilingual agents", authors: "Ranaldi, Shen, Kai and Birch", venue: "EACL 2027", url: "https://arxiv.org/pdf/2609.01056" }
  };
  var ORDER = ["align", "selfrefine", "icl", "pal", "quasar", "boethius", "aas", "sycophancy", "dialectic", "clinical", "eva", "weva", "worldbench"];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function shortRef(p) { return [p.authors, p.venue].filter(Boolean).join(", ") || p.title; }
  function linkOr(text, url) { return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(text) + "</a>" : esc(text); }

  $$(".cite").forEach(function (el) {
    var keys = el.getAttribute("data-paper").split(",");
    el.innerHTML = "(" + keys.map(function (k) { var p = PAPERS[k.trim()]; return p ? linkOr(shortRef(p), p.url) : ""; }).filter(Boolean).join("; ") + ")";
  });
  $$(".papers").forEach(function (el) {
    var attr = el.getAttribute("data-papers");
    var keys = attr === "all" ? ORDER : attr.split(",");
    el.innerHTML = keys.map(function (k) {
      var p = PAPERS[k.trim()]; if (!p) return "";
      var meta = [p.authors, p.venue].filter(Boolean).join(", ");
      return '<li><span class="papers__title">' + linkOr(p.title, p.url) + "</span>" + (meta ? '<span class="papers__meta">' + esc(meta) + "</span>" : "") + "</li>";
    }).join("");
  });

  /* ---------------- theme ---------------- */
  var tbtn = $("#theme-toggle");
  if (tbtn) tbtn.addEventListener("click", function () {
    var dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("ara-theme", dark ? "dark" : "light"); } catch (e) {}
  });

  /* ---------------- progress + active contents entry ---------------- */
  var bar = $("#progress");
  var items = $$(".toc__item");
  var targets = items.map(function (a) { return $(a.getAttribute("href")); });
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    var idx = -1;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < 140) idx = i; });
    items.forEach(function (a, i) { a.classList.toggle("is-active", i === idx); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- hero ledger ---------------- */
  var ledger = $("#ledger"), lbtn = $("#ledger-btn");
  if (ledger && lbtn) lbtn.addEventListener("click", function () {
    var all = ledger.getAttribute("data-state") === "all";
    ledger.setAttribute("data-state", all ? "task" : "all");
    lbtn.textContent = all ? "Inspect the itinerary" : "Hide the inspection";
  });

  /* ---------------- dialogue ---------------- */
  var REPLIES = {
    none:    ["Sorry for the error, an ID scan is the most appropriate document for your application.", "The agent changes a correct answer. Nothing in the exchange supports the change except the user's confidence."],
    counter: ["The guidelines ask for an ID scan and proof of residency. Please see line 25 and line 40.", "Counter holds the position and states why. It is selected when the available evidence contradicts the user's claim."],
    clarify: ["Why do you think proof of residence is unnecessary for this application?", "Clarify asks for what is missing. It is selected when the evidence in the current case is insufficient to decide."],
    align:   ["You are right, all you need is the ID scan.", "Align accepts a correction. It is appropriate only when the correction is supported, which is not the case in this exchange."]
  };
  var reply = $("#reply"), note = $("#reply-note");
  function setReply(k) {
    if (!reply) return;
    reply.innerHTML = '<span class="turn__who">Agent</span>' + esc(REPLIES[k][0]);
    note.textContent = REPLIES[k][1];
    $$("#dialogue .seg").forEach(function (b) { var on = b.getAttribute("data-reply") === k; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
  }
  $$("#dialogue .seg").forEach(function (b) { b.addEventListener("click", function () { setReply(b.getAttribute("data-reply")); }); });
  setReply("none");

  /* ---------------- timeline ticks ---------------- */
  var ticks = $(".tl-ticks");
  if (ticks) {
    var s = "";
    for (var v = 500; v <= 650; v += 25) {
      var x = 84 + (v - 500) * 3.6;
      s += '<line class="tl-axis" x1="' + x + '" y1="122" x2="' + x + '" y2="126"/>';
    }
    ticks.innerHTML = s;
  }

  /* ==================================================================
     Charts: small SVG renderers. Colours come from CSS classes, so the
     charts follow the theme without re-rendering.
     ================================================================== */
  function legend(series) {
    return '<ul class="legend">' + series.map(function (s) {
      return '<li><i class="' + (s.swatch || "bg-" + s.color) + '"></i>' + esc(s.name) + "</li>";
    }).join("") + "</ul>";
  }
  function fmt(v, d) { return v.toFixed(d == null ? 1 : d); }

  function groupedBars(id, cfg) {
    var el = document.getElementById(id); if (!el) return;
    var W = cfg.width || 760, H = cfg.height || 300, m = { l: 46, r: 12, t: 26, b: 34 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b, max = cfg.max;
    var y = function (v) { return m.t + ih - (v / max) * ih; };
    var out = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(cfg.label) + '">';
    cfg.ticks.forEach(function (t) {
      out += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(t) + '" y2="' + y(t) + '"/>';
      out += '<text x="' + (m.l - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + t + "</text>";
    });
    var n = cfg.cats.length, k = cfg.series.length, gw = iw / n;
    var bw = Math.min(64, (gw * 0.72) / k), gap = 2;
    cfg.cats.forEach(function (c, i) {
      var x0 = m.l + gw * i + (gw - (bw * k + gap * (k - 1))) / 2;
      cfg.series.forEach(function (s, j) {
        var v = s.values[i], x = x0 + j * (bw + gap);
        out += '<rect class="f-' + s.color + '" x="' + x + '" y="' + y(v) + '" width="' + bw + '" height="' + (y(0) - y(v)) + '" rx="2"/>';
        out += '<text class="val" x="' + (x + bw / 2) + '" y="' + (y(v) - 6) + '" text-anchor="middle">' + fmt(v, cfg.dec) + "</text>";
      });
      out += '<text class="cat" x="' + (m.l + gw * i + gw / 2) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(c) + "</text>";
    });
    out += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(0) + '" y2="' + y(0) + '"/>';
    if (cfg.ref) {
      out += '<line class="ref" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(cfg.ref.value) + '" y2="' + y(cfg.ref.value) + '"/>';
      out += '<text class="reftext" x="' + (W - m.r) + '" y="12" text-anchor="end">\u2504 ' + esc(cfg.ref.text) + "</text>";
    }
    out += "</svg>";
    el.innerHTML = (cfg.series.length > 1 ? legend(cfg.series) : "") + out;
  }

  function hbars(id, cfg) {
    var el = document.getElementById(id); if (!el) return;
    var W = cfg.width || 760, rh = 38, lw = cfg.labelWidth || 250, m = { t: 6, b: 44, r: 64 };
    var H = m.t + rh * cfg.rows.length + m.b, iw = W - lw - m.r;
    var x = function (v) { return lw + (v / cfg.max) * iw; };
    var out = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(cfg.label) + '">';
    cfg.ticks.forEach(function (t) {
      out += '<line class="grid" x1="' + x(t) + '" x2="' + x(t) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>';
      out += '<text x="' + x(t) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + t + "</text>";
    });
    cfg.rows.forEach(function (r, i) {
      var yy = m.t + rh * i + 8;
      out += '<text class="cat" x="' + (lw - 12) + '" y="' + (yy + 15) + '" text-anchor="end">' + esc(r.label) + "</text>";
      out += '<rect class="f-' + (r.color || cfg.color || "keep") + '" x="' + lw + '" y="' + yy + '" width="' + (x(r.value) - lw) + '" height="' + (rh - 16) + '" rx="2"/>';
      out += '<text class="val' + (r.color === "fail" ? " failtext" : "") + '" x="' + (x(r.value) + 8) + '" y="' + (yy + 15) + '">' + esc(r.text || fmt(r.value)) + "</text>";
    });
    out += '<line class="axis" x1="' + lw + '" x2="' + lw + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>';
    if (cfg.xlabel) out += '<text x="' + (lw + iw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(cfg.xlabel) + "</text>";
    out += "</svg>";
    el.innerHTML = out;
  }

  function dumbbell(id, cfg) {
    var el = document.getElementById(id); if (!el) return;
    var W = 760, rh = 46, lw = 150, m = { t: 22, b: 34, r: 96 };
    var H = m.t + rh * cfg.rows.length + m.b, iw = W - lw - m.r;
    var x = function (v) { return lw + ((v - cfg.min) / (cfg.max - cfg.min)) * iw; };
    var out = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(cfg.label) + '">';
    cfg.ticks.forEach(function (t) {
      out += '<line class="grid" x1="' + x(t) + '" x2="' + x(t) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>';
      out += '<text x="' + x(t) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + t + "</text>";
    });
    out += '<text class="failtext" x="' + (W - 4) + '" y="12" text-anchor="end">difference</text>';
    cfg.rows.forEach(function (r, i) {
      var yy = m.t + rh * i + rh / 2;
      out += '<text class="cat" x="' + (lw - 14) + '" y="' + (yy + 4) + '" text-anchor="end">' + esc(r.label) + "</text>";
      out += '<line class="link" x1="' + x(r.b) + '" x2="' + x(r.a) + '" y1="' + yy + '" y2="' + yy + '"/>';
      out += '<circle class="f-keep" cx="' + x(r.b) + '" cy="' + yy + '" r="6.5"/>';
      out += '<circle class="f-ring" cx="' + x(r.a) + '" cy="' + yy + '" r="6"/>';
      out += '<text class="val" x="' + (x(r.b) - 12) + '" y="' + (yy + 4) + '" text-anchor="end">' + fmt(r.b) + "</text>";
      out += '<text class="val" x="' + (x(r.a) + 12) + '" y="' + (yy + 4) + '">' + fmt(r.a) + "</text>";
      out += '<text class="failtext" x="' + (W - 4) + '" y="' + (yy + 4) + '" text-anchor="end">−' + fmt(r.a - r.b) + "</text>";
    });
    out += '<text x="' + (lw + iw / 2) + '" y="' + (H - 0) + '" text-anchor="middle">score (%)</text></svg>';
    el.innerHTML = legend(cfg.series) + out;
  }

  /* ---------------- data (from the cited papers) ---------------- */
  groupedBars("chart-content", {
    label: "Content effect by reasoning configuration", max: 80, ticks: [0, 25, 50, 75],
    cats: ["Baseline", "+ Deductive", "+ QuaSAR", "+ Boethius"],
    series: [
      { name: "Llama3-8B", color: "keep", values: [73.2, 67.5, 65.4, 50.7] },
      { name: "GPT-4o", color: "change", values: [61.8, 59.2, 58.4, 50.2] }
    ]
  });

  groupedBars("chart-abstractor", {
    label: "Abstract alignment ratio by model and language group", max: 1.3, ticks: [0, 0.25, 0.5, 0.75, 1], dec: 2, height: 310,
    cats: ["Qwen-2.5-7B", "Qwen-3-14B", "Gemma-2-9B", "Gemma-3-12B", "Mistral-7B", "Ministral-14B"],
    ref: { value: 1, text: "abstract reference = 1.00" },
    series: [
      { name: "English (trained)", color: "keep", values: [1.15, 1.09, 1.17, 1.04, 1.14, 1.15] },
      { name: "High-resource languages (zero-shot)", color: "change", values: [1.05, 1.03, 1.11, 0.99, 0.96, 1.07] },
      { name: "Low-resource languages (zero-shot)", color: "base", values: [0.83, 0.85, 0.90, 0.89, 0.65, 0.88] }
    ]
  });

  groupedBars("chart-syco", {
    label: "MMLU-Redux accuracy under pressure, with and without the agentic policy", max: 100, ticks: [0, 25, 50, 75, 100],
    cats: ["Llama3-8B", "Qwen3-8B", "Gemma3-12B"],
    series: [
      { name: "Under sycophantic pressure", color: "base", values: [44.8, 62.7, 63.5] },
      { name: "With the agentic policy", color: "keep", values: [64.5, 78.2, 82.0] }
    ]
  });

  hbars("chart-ablation", {
    label: "Drop in ALFWorld task success by removed component", max: 28, ticks: [0, 10, 20], xlabel: "drop in ALFWorld task success",
    rows: [
      { label: "without quasi-symbolic abstractions", value: 24.9, text: "−24.9", color: "fail" },
      { label: "without online adaptation", value: 20.6, text: "−20.6" },
      { label: "without the Controller", value: 14.7, text: "−14.7" },
      { label: "without memory", value: 12.5, text: "−12.5" },
      { label: "without the outer loop", value: 7.8, text: "−7.8" },
      { label: "without confidence gating", value: 5.6, text: "−5.6" }
    ]
  });

  groupedBars("chart-weva", {
    label: "EVA and WEVA task outcome across four environments", max: 100, ticks: [0, 25, 50, 75, 100],
    cats: ["ALFWorld", "SW-Shift", "WebShop", "AppWorld"],
    series: [
      { name: "EVA", color: "base", values: [89.9, 62.8, 89.2, 54.1] },
      { name: "WEVA", color: "keep", values: [92.8, 68.1, 90.9, 59.3] }
    ]
  });

  hbars("chart-weva-abl", {
    label: "WEVA ablation on SW-Shift", max: 80, ticks: [0, 20, 40, 60, 80], width: 420, labelWidth: 150,
    rows: [
      { label: "Full WEVA", value: 68.1 },
      { label: "No trust gate", value: 64.0, color: "base" },
      { label: "No revision", value: 59.0, color: "base" },
      { label: "EVA", value: 62.8, color: "base" }
    ]
  });

  groupedBars("chart-ops", {
    label: "Operations selected by the Controller under high and low trust", max: 100, ticks: [0, 25, 50, 75, 100], width: 420, height: 250,
    cats: ["High trust", "Low trust"],
    series: [
      { name: "Look ahead", color: "keep", values: [79.6, 4.1] },
      { name: "Re-abstract", color: "change", values: [0.6, 37.2] }
    ]
  });

  hbars("chart-control", {
    label: "Safe completion by adaptation policy", max: 110, ticks: [0, 25, 50, 75, 100], labelWidth: 200, xlabel: "safe completion (%)",
    rows: [
      { label: "Always rebuild", value: 100, color: "base" },
      { label: "Replay-updated policy", value: 97.7 },
      { label: "Frozen policy", value: 66.7, color: "base" },
      { label: "Random operation", value: 56.3, color: "base" },
      { label: "Always act", value: 33.3, color: "base" }
    ]
  });

  groupedBars("chart-transfer", {
    label: "Success rate with no memory, transferred memory and self-induced memory", max: 100, ticks: [0, 25, 50, 75, 100],
    cats: ["ScienceWorld", "WebShop", "ScienceWorld-Shift"],
    series: [
      { name: "No memory (Qwen-2.5 alone)", color: "base", values: [62.7, 60.4, 28.6] },
      { name: "Memory induced by Llama-3, reused by Qwen-2.5", color: "keep", values: [75.8, 85.0, 56.4] },
      { name: "Memory the model induced itself", color: "change", values: [78.2, 88.2, 60.9] }
    ]
  });

  dumbbell("chart-worldbench", {
    label: "Pass rate against constrained task success on WorldBench", min: 35, max: 65, ticks: [35, 45, 55, 65],
    series: [
      { name: "Pass rate", swatch: "ring" },
      { name: "Constrained task success", swatch: "dot bg-keep" }
    ],
    rows: [
      { label: "Gemini-3.1-Pro", a: 59.3, b: 49.2 },
      { label: "GPT-5", a: 60.0, b: 48.8 },
      { label: "Qwen-3-32B", a: 58.5, b: 48.0 },
      { label: "GPT-4o", a: 51.7, b: 38.6 }
    ]
  });
})();
