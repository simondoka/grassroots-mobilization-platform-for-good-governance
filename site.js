// ===== SETTINGS: edit these =====
// Live member counter: paste your Google Apps Script web-app URL (see README-SETUP.md). Leave "" to hide the number.
var COUNT_URL = "";
// Members who joined before the form existed (added to the form count)
var MEMBERS_BASE = 0;
// Facebook page link (leave "" until you have it)
var FB_URL = "";
// =================================

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* header, progress, menu */
var hd = $('#hd'), bar = $('#bar'), mn = $('#mn');
function sc() {
  var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  hd.classList.toggle('s', y > 40 || document.body.classList.contains('sub'));
  bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
}
addEventListener('scroll', sc, {passive: true}); sc();
$('#mb').onclick = function () { mn.classList.toggle('on'); };
mn.onclick = function (e) { if (e.target.tagName === 'A') mn.classList.remove('on'); };
$$('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });

/* reveal on scroll */
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold: .08});
$$('.rv').forEach(function (el) { io.observe(el); });

/* background video (skipped on data-saver / slow networks / reduced motion) */
var bg = $('#bgv');
if (bg) {
  var c = navigator.connection || {};
  var slow = c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
  if (!reduce && !slow) {
    bg.src = 'videos/bg.mp4';
    bg.play().catch(function () {});
  }
}

/* sliders */
$$('.sl').forEach(function (sl) {
  var slides = $$('.sl-s', sl), dots = $('.sl-d', sl), cur = 0, t, hold = false;
  slides.forEach(function (s, i) {
    s.style.setProperty('--bg', 'url(' + $('img', s).getAttribute('src') + ')');
    var d = document.createElement('i'); d.onclick = function () { go(i, true); }; dots.appendChild(d);
  });
  function go(n, user) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('on', i === cur); });
    $$('i', dots).forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    if (user) restart();
  }
  function restart() { clearInterval(t); if (!reduce) t = setInterval(function () { if (!hold && !document.hidden) go(cur + 1); }, 5500); }
  $('.p', sl).onclick = function () { go(cur - 1, true); };
  $('.n', sl).onclick = function () { go(cur + 1, true); };
  sl.onmouseenter = function () { hold = true; }; sl.onmouseleave = function () { hold = false; };
  var x0 = null;
  sl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; hold = true; }, {passive: true});
  sl.addEventListener('touchend', function (e) {
    if (x0 !== null) { var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true); }
    x0 = null; hold = false;
  });
  go(0); restart();
});

/* prominent video: muted preview loops; opening it plays full video WITH sound */
var vm = $('#vm');
if (vm) {
  var mv = $('video', vm);
  var openVideo = function () {
    if (bg) bg.pause();
    mv.src = 'videos/full.mp4'; mv.muted = false; mv.volume = 1;
    vm.classList.add('on');
    mv.play().catch(function () {});
  };
  var closeVideo = function () {
    mv.pause(); mv.removeAttribute('src'); mv.load(); vm.classList.remove('on');
    if (bg && bg.getAttribute('src')) bg.play().catch(function () {});
  };
  $$('.openvid').forEach(function (b) { b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); openVideo(); }; });
  var vb = $('.vb');
  if (vb) { vb.onclick = openVideo; vb.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); } }; }
  $('.x', vm).onclick = closeVideo;
  vm.onclick = function (e) { if (e.target === vm) closeVideo(); };
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && vm.classList.contains('on')) closeVideo(); });
}

/* live member counter */
var cn = $('#cn'), numEl = $('#num'), shown = 0;
function animate(to) {
  var from = shown, t0 = performance.now(), dur = reduce ? 1 : 1400;
  (function step(t) {
    var p = Math.min((t - t0) / dur, 1);
    shown = Math.round(from + (to - from) * p);
    numEl.textContent = shown.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
function pull() {
  fetch(COUNT_URL).then(function (r) { return r.json(); }).then(function (d) {
    var n = (parseInt(d.count, 10) || 0) + MEMBERS_BASE;
    $('#cnnum').hidden = false; animate(n);
  }).catch(function () {});
}
if (cn && COUNT_URL) { pull(); setInterval(pull, 60000); }

/* social links */
$$('.fb').forEach(function (a) {
  if (FB_URL) { a.href = FB_URL; a.target = '_blank'; a.rel = 'noopener'; }
  else { a.onclick = function (e) { e.preventDefault(); }; a.title = 'Facebook link coming soon'; a.style.opacity = '.7'; }
});

/* lightbox for poster and photo links */
var lb = $('#lb');
if (lb) {
  var li = $('img', lb);
  $$('.tri a, .zoom').forEach(function (a) {
    a.onclick = function (e) { e.preventDefault(); var i = $('img', a); li.src = a.getAttribute('href'); li.alt = i.alt; lb.classList.add('on'); };
  });
  lb.onclick = function () { lb.classList.remove('on'); };
  addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
}
