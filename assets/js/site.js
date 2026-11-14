/* Homepage behaviour: theme switch, external links, Google Scholar counts.
   No dependencies. */
(function () {
  "use strict";

  var btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", function () {
    var dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("ara-theme", dark ? "dark" : "light"); } catch (e) {}
  });

  /* external links open in a new tab; internal links and anchors stay in place */
  Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
    if (a.host && a.host !== location.host) { a.target = "_blank"; a.rel = "noopener"; }
  });

})();
