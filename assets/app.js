// Lottie первого экрана: в CMS это блок Lottie с файлом assets/lottie/lobster-kv.json.
(function () {
  var box = document.getElementById('lobster');
  if (!box || !window.lottie || !window.LOBSTER_KV) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: !still, animationData: window.LOBSTER_KV });
  window.lobsterAnim = anim;
  if ('IntersectionObserver' in window && !still) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? anim.play() : anim.pause(); }).observe(box);
  }
})();

// Меню на телефоне
(function () {
  var btn = document.querySelector('.header-burger'), nav = document.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
})();

// Ссылка на регистрацию появится позже: пустая ссылка не перезагружает страницу
document.querySelectorAll('a[href=""]').forEach(function (a) {
  a.addEventListener('click', function (e) { e.preventDefault(); });
});

// Карусель спикеров
(function () {
  var track = document.getElementById('track'), dots = document.getElementById('dots');
  var prev = document.querySelector('.carousel-arrow.prev'), next = document.querySelector('.carousel-arrow.next');
  var cards = track.children;
  function step() { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; }
  function update() {
    var max = track.scrollWidth - track.clientWidth - 2;
    // точек столько, сколько положений у карусели
    var positions = Math.max(1, Math.ceil(max / step()) + 1);
    while (dots.children.length < positions) dots.appendChild(document.createElement('span'));
    while (dots.children.length > positions) dots.removeChild(dots.lastChild);
    var idx = track.scrollLeft >= max ? positions - 1 : Math.round(track.scrollLeft / step());
    for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('on', j === idx);
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }
  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Вкладки залов
(function () {
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = Array.prototype.slice.call(tabs), i = list.indexOf(tab);
      var t = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      select(t); t.focus();
    });
  });
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
})();

// Видео: при заполненной ссылке VK Video плеер встаёт вместо обложки
document.querySelectorAll('.video-slot').forEach(function (slot) {
  slot.querySelector('.video-play').addEventListener('click', function () {
    var src = slot.getAttribute('data-vk-src');
    if (!src) return;
    var f = document.createElement('iframe');
    f.src = src + (src.indexOf('?') < 0 ? '?' : '&') + 'autoplay=1';
    f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    f.allowFullscreen = true;
    f.title = 'Тизеры докладов';
    slot.appendChild(f);
    this.remove();
  });
});
