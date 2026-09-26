(function () {
  var canvas = document.getElementById('bgfx');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var glyphs = '01アイキABCDEF{}[]<>#$_/\\'.split('');
  var fontSize = 14;
  var columns = 0;
  var drops = [];
  var colors = ['#ffb100', '#4fd1c5'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(function () {
      return Math.random() * -100;
    });
  }

  function draw() {
    ctx.fillStyle = 'rgba(18, 15, 12, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (var i = 0; i < columns; i++) {
      var glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      var x = i * fontSize;
      var y = drops[i] * fontSize;
      ctx.fillStyle = colors[i % 2];
      ctx.fillText(glyph, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.35;
    }
  }

  var rafId = null;
  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();

  if (reduceMotion) {
    // Render a single static, very faint pass instead of a continuous animation.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    loop();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        loop();
      }
    });
  }
})();
