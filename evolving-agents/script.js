/* Evolving Agents: page behaviour, paper registry and charts.
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

  /* ---------------- tabs ---------------- */
  $$("[data-tabs]").forEach(function (box) {
    var btns = $$("[data-tab]", box), panels = $$("[data-panel]", box);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-tab");
        btns.forEach(function (o) { o.classList.toggle("is-active", o === b); });
        panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== k; });
      });
    });
  });

  /* ---------------- data (from the EVA and WEVA papers) ---------------- */
  hbars("chart-form", {
    label: "ALFWorld success by configuration", max: 100, ticks: [0, 25, 50, 75, 100], labelWidth: 280, xlabel: "ALFWorld success (%)",
    rows: [
      { label: "Full EVA", value: 88.7 },
      { label: "Typed document, frozen weights", value: 86.5, color: "base" },
      { label: "Free-text skills, frozen weights", value: 82.1, color: "base" },
      { label: "Without memory", value: 76.2, color: "base" },
      { label: "Without the Controller", value: 74.0, color: "base" },
      { label: "Without quasi-symbolic abstractions", value: 63.8, color: "fail" },
      { label: "Raw trajectories as memory", value: 58.2, color: "fail" }
    ]
  });

  hbars("chart-shift", {
    label: "SW-Shift success by configuration", max: 80, ticks: [0, 20, 40, 60, 80], labelWidth: 280, xlabel: "SW-Shift success (%)",
    rows: [
      { label: "Frozen, generic document", value: 49.5, text: "about 49.5", color: "base" },
      { label: "Frozen, calibrated document (EVA-Doc)", value: 55.8, color: "base" },
      { label: "Successes only (EVA-S)", value: 57.2, color: "base" },
      { label: "Actor-only adaptation (EVA-A)", value: 58.1, color: "base" },
      { label: "Full EVA", value: 60.9 }
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

  groupedBars("chart-check", {
    label: "ALFWorld success and logical-error rate, from no lookahead to verified lookahead", max: 100, ticks: [0, 25, 50, 75, 100],
    cats: ["No lookahead", "Lookahead, no check", "Lookahead with check (WEVA)"],
    series: [
      { name: "ALFWorld success (%)", color: "keep", values: [89.7, 91.1, 92.8] },
      { name: "Logical-error rate (%)", color: "fail", values: [5.9, 5.4, 3.2] }
    ]
  });

  groupedBars("chart-ops", {
    label: "Meta-actions selected under high and low model trust", max: 100, ticks: [0, 25, 50, 75, 100],
    cats: ["High model trust", "Low model trust"],
    series: [
      { name: "Lookahead", color: "keep", values: [79.6, 4.1] },
      { name: "Abstract", color: "change", values: [0.6, 37.2] }
    ]
  });

  hbars("chart-wb", {
    label: "Constrained task success on WorldBench", max: 60, ticks: [0, 20, 40, 60], labelWidth: 160, xlabel: "constrained task success (%), average over languages",
    rows: [
      { label: "Direct", value: 34.6, color: "base" },
      { label: "ReAct", value: 35.9, color: "base" },
      { label: "EVA-Doc", value: 40.1, color: "base" },
      { label: "WEVA-Doc", value: 48.3 }
    ]
  });
})();
