(function () {
  var boot = document.getElementById('boot');
  if (!boot) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alreadyBooted = sessionStorage.getItem('sogga_booted') === '1';

  if (alreadyBooted || reduceMotion) {
    boot.setAttribute('data-hidden', 'true');
    return;
  }

  var log = document.getElementById('boot-log');
  var lines = [
    { text: '[boot] initializing soggal1ng.sys ...', cls: '' },
    { text: '[ ok ] loading kernel modules', cls: 'ok' },
    { text: '[ ok ] mounting /projects', cls: 'ok' },
    { text: '[ ok ] mounting /skills', cls: 'ok' },
    { text: '[ ok ] starting batch.exe  powershell.exe  csharp.dll', cls: 'ok' },
    { text: '[ ok ] establishing uplink via tailscale', cls: 'ok' },
    { text: '[done] welcome, guest.', cls: 'done' }
  ];

  var i = 0;
  function next() {
    if (i >= lines.length) {
      finish();
      return;
    }
    var row = document.createElement('div');
    row.className = 'line ' + lines[i].cls;
    row.textContent = lines[i].text;
    row.style.animationDelay = '0s';
    log.appendChild(row);
    i++;
    setTimeout(next, 160);
  }

  function finish() {
    sessionStorage.setItem('sogga_booted', '1');
    setTimeout(function () {
      boot.setAttribute('data-hidden', 'true');
    }, 500);
  }

  function skip() {
    boot.setAttribute('data-hidden', 'true');
    sessionStorage.setItem('sogga_booted', '1');
  }

  window.addEventListener('keydown', skip, { once: true });
  boot.addEventListener('click', skip, { once: true });

  next();
})();
