/* MONO — potenziamento: inclinazione 3D delle card verso il cursore.
   Additivo, non tocca la logica esistente. Solo mouse fine + rispetta reduced-motion. */
(function () {
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  var MAX = 7; // gradi: sobrio, elegante (non giocattolo)

  function bind(card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (0.5 - py) * MAX;
      var ry = (px - 0.5) * MAX;
      card.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" +
        ry.toFixed(2) + "deg) translateY(-8px) scale(1.012)";
    });
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  }

  function init() {
    document.querySelectorAll(".page-card").forEach(bind);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
