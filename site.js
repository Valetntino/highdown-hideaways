// Date helpers for the Airbnb hand-off. The form works without this file; this only stops impossible dates,
// shows dates in words ('Fri 13 Nov') over the native input, and leaves empty fields out of the Airbnb link.
(function () {
  var ci = document.getElementById('ci'), co = document.getElementById('co'), form = document.getElementById('book');
  if (!ci || !co || !form) return;
  function iso(d) { return d.toISOString().slice(0, 10); }
  function show(el) {
    var s = el.parentNode.querySelector('.shown');
    if (!s) return;
    if (!el.value) { s.textContent = 'Add date'; s.classList.add('empty'); return; }
    var p = el.value.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    s.textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    s.classList.remove('empty');
  }
  function pick(el) { try { el.showPicker(); } catch (err) { /* older browsers: the native control still works */ } }
  var today = new Date(); ci.min = iso(today);
  ci.addEventListener('change', function () {
    if (!ci.value) return;
    var next = new Date(ci.value); next.setDate(next.getDate() + 1);
    co.min = iso(next);
    if (!co.value || co.value <= ci.value) co.value = iso(next);
    show(co);
  });
  [ci, co].forEach(function (el) {
    el.addEventListener('input', function () { show(el); });
    el.addEventListener('change', function () { show(el); });
    el.addEventListener('click', function () { pick(el); });
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(el); }
    });
    show(el);
  });
  var ad = document.getElementById('ad'), gu = document.getElementById('gu');
  form.addEventListener('submit', function () {
    if (ad && gu) gu.value = ad.value;  // the hand-off URL that kept dates and party size on 23 Oct 2026 carried both adults= and guests=
    [ci, co].forEach(function (el) { if (!el.value) el.disabled = true; });
    setTimeout(function () { ci.disabled = false; co.disabled = false; }, 0);
  });
})();
