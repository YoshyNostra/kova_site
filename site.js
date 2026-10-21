/* Kova — interactions du site vitrine */
(function () {
  var d = document, w = window;

  /* Année dynamique */
  var yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Header : bordure au scroll */
  var hd = d.getElementById('hd');
  var onScroll = function () { hd.classList.toggle('on', w.scrollY > 8); };
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  var drawer = d.getElementById('drawer'), veil = d.getElementById('veil');
  function openDrawer() { drawer.classList.add('open'); veil.classList.add('on'); }
  function closeDrawer() { drawer.classList.remove('open'); veil.classList.remove('on'); }
  d.getElementById('burger').addEventListener('click', openDrawer);
  d.getElementById('closeDrawer').addEventListener('click', closeDrawer);
  veil.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  /* Décor : dégradés animés dessinés au canvas, sans image externe */
  function drawDecor(cv) {
    var kind = cv.getAttribute('data-grad');
    var box = cv.parentElement.getBoundingClientRect();
    var wpx = Math.max(box.width, 320), hpx = Math.max(box.height, 240);
    var dpr = Math.min(w.devicePixelRatio || 1, 2);
    cv.width = Math.round(wpx * dpr); cv.height = Math.round(hpx * dpr);
    cv.style.width = '100%'; cv.style.height = '100%';
    var g = cv.getContext('2d');
    g.scale(dpr, dpr);

    var v = 0;
    function frame() {
      v += 0.0028;
      g.clearRect(0, 0, wpx, hpx);
      g.fillStyle = kind === 'bubble' ? '#eef0f4' : '#f4f5f8';
      g.fillRect(0, 0, wpx, hpx);

      var blobs = kind === 'bubble'
        ? [[wpx * .3, hpx * .55, hpx * .5], [wpx * .72, hpx * .42, hpx * .42]]
        : [[wpx * .12, hpx * .2, hpx * .75], [wpx * .88, hpx * .3, hpx * .7], [wpx * .5, hpx * .95, hpx * .6]];

      blobs.forEach(function (b, i) {
        var x = b[0] + Math.sin(v * (1 + i * .4)) * hpx * .09;
        var y = b[1] + Math.cos(v * (1.2 + i * .3)) * hpx * .07;
        var r = b[2] * (1 + Math.sin(v * 1.6 + i) * .06);
        var grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, 'rgba(47,69,255,' + (kind === 'bubble' ? .38 : .5) + ')');
        grd.addColorStop(.55, 'rgba(120,140,255,.18)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
      });

      /* Grain */
      var id = g.getImageData(0, 0, cv.width, cv.height);
      var p = id.data;
      for (var i = 0; i < p.length; i += 4) {
        var n = (Math.random() - .5) * 16;
        p[i] += n; p[i + 1] += n; p[i + 2] += n;
      }
      g.putImageData(id, 0, 0);

      if (kind === 'bubble') {
        /* Bulle de discussion dessinée en pointillés */
        g.strokeStyle = 'rgba(47,69,255,.85)'; g.lineWidth = 3; g.setLineDash([2, 6]); g.lineCap = 'round';
        var bw = Math.min(wpx * .58, 520), bh = bw * .52;
        var bx = (wpx - bw) / 2, by = (hpx - bh) / 2 - bh * .1, rad = bh * .22;
        g.beginPath();
        g.moveTo(bx + rad, by);
        g.lineTo(bx + bw - rad, by); g.quadraticCurveTo(bx + bw, by, bx + bw, by + rad);
        g.lineTo(bx + bw, by + bh - rad); g.quadraticCurveTo(bx + bw, by + bh, bx + bw - rad, by + bh);
        g.lineTo(bx + bw * .38, by + bh); g.lineTo(bx + bw * .2, by + bh + bh * .34); g.lineTo(bx + bw * .22, by + bh);
        g.lineTo(bx + rad, by + bh); g.quadraticCurveTo(bx, by + bh, bx, by + bh - rad);
        g.lineTo(bx, by + rad); g.quadraticCurveTo(bx, by, bx + rad, by);
        g.stroke(); g.setLineDash([]);
        var dots = [.36, .5, .64];
        dots.forEach(function (f) {
          for (var k = 0; k < 90; k++) {
            var a = Math.random() * 6.2832, rr = rad * .42 * Math.sqrt(Math.random());
            g.fillStyle = 'rgba(47,69,255,.7)';
            g.fillRect(bx + bw * f + Math.cos(a) * rr, by + bh * .5 + Math.sin(a) * rr, 2, 2);
          }
        });
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
  d.querySelectorAll('.pix').forEach(drawDecor);

  /* Compteur de serveurs */
  var names = ['Black Thorn RP', 'Union FA', 'Mirage RP', 'Solaris RP', 'Nova Life', 'Horizon RP', 'Crimson City', 'Atlas RP'];
  var cloud = d.getElementById('cloud');
  if (cloud) {
    for (var i = 0; i < 8; i++) {
      var el = d.createElement('div');
      el.className = 'sv';
      el.style.setProperty('--rot', ((i % 3) - 1) * 2.4 + 'deg');
      el.innerHTML = '<i></i><b>' + names[i] + '</b><span>· Kova</span>';
      cloud.appendChild(el);
    }
  }

  /* Onglets produit */
  d.getElementById('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    d.querySelectorAll('.tab-btns button').forEach(function (x) { x.classList.remove('on'); });
    d.querySelectorAll('.tp').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    d.getElementById('t-' + b.getAttribute('data-tab')).classList.add('on');
  });

  /* Périodes de facturation */
  var FACTOR = { month: [1, '/mois'], '6months': [5.4, '/6 mois'], year: [10, '/an'], lifetime: [0, ''] };
  var LIFE = { month: 39, '6months': 39, year: 39, lifetime: 39 };
  var BASE = { month: 39, '6months': 39, year: 39, lifetime: 899 };
  d.getElementById('periods').addEventListener('click', function (e) {
    var b = e.target.closest('[data-period]'); if (!b) return;
    d.querySelectorAll('#periods button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    var per = b.getAttribute('data-period');
    d.querySelectorAll('.plan').forEach(function (plan, idx) {
      var base = idx === 0 ? 39 : idx === 1 ? 69 : 119;
      var el = plan.querySelector('[data-price]'), pe = plan.querySelector('[data-per]');
      if (per === 'lifetime') { el.textContent = (base * 22) + ' €'; pe.textContent = ' une fois · à vie'; }
      else if (per === 'year') { el.textContent = (base * 10) + ' €'; pe.textContent = '/an'; }
      else if (per === '6months') { el.textContent = (base * 5.4) + ' €'; pe.textContent = '/6 mois'; }
      else { el.textContent = base + ' €'; pe.textContent = '/mois'; }
    });
  });
})();
