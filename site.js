// Phone menu: one tap opens the section list, a tap on a link (or outside, or Escape) closes it.
// The phone booking bar steps aside while the booking form itself is on screen, so it never covers the form.
(function () {
  var top = document.querySelector('.top'), btn = document.querySelector('.menu-btn');
  if (top && btn) {
    function set(open) { top.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function () { set(!top.classList.contains('open')); });
    top.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('click', function (ev) { if (!top.contains(ev.target)) set(false); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') set(false); });
  }
  var bar = document.querySelector('.mbar'), book = document.getElementById('book');
  if (bar && book && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { bar.classList.toggle('away', es[0].isIntersecting); }).observe(book);
  }
})();
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
// Direct price: the "ask us for a price for your dates" email carries the dates and party typed in the booking bar,
// so a guest who prefers to book direct does not have to type them again (research/growth-v1, 24 Oct 2026).
(function () {
  var ask = document.getElementById('ask'), ci = document.getElementById('ci'), co = document.getElementById('co'),
      ad = document.getElementById('ad');
  if (!ask || !ci || !co || !ad) return;
  var base = ask.getAttribute('href').split('?')[0];
  function words(v) {
    if (!v) return 'not chosen yet';
    var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function update() {
    var body = 'Hello Luca and Trina,\n\nPlease could you give us a direct price for Elderflower Lodge.\n\nArrive: ' + words(ci.value) +
      '\nLeave: ' + words(co.value) + '\nGuests: ' + ad.value + '\n\nThank you,\n';
    ask.setAttribute('href', base + '?subject=' + encodeURIComponent('Elderflower Lodge: a direct price') + '&body=' + encodeURIComponent(body));
  }
  [ci, co, ad].forEach(function (el) { el.addEventListener('change', update); el.addEventListener('input', update); });
  update();
})();
