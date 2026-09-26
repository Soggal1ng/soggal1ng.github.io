(function () {
  var clockEl = document.getElementById('clock-time');
  if (clockEl) {
    function tick() {
      var d = new Date();
      var hh = String(d.getHours()).padStart(2, '0');
      var mm = String(d.getMinutes()).padStart(2, '0');
      var ss = String(d.getSeconds()).padStart(2, '0');
      clockEl.textContent = hh + ':' + mm + ':' + ss;
    }
    tick();
    setInterval(tick, 1000);
  }

  var bar = document.getElementById('cmdbar');
  var toggle = document.getElementById('cmdbar-toggle');
  var input = document.getElementById('cmd-input');
  var output = document.getElementById('cmd-output');
  if (!bar || !toggle || !input || !output) return;

  var pages = {
    home: 'index.html',
    projects: 'projects.html',
    about: 'about.html',
    connect: 'connect.html'
  };

  var history = [];
  var historyIndex = -1;

  function println(text, cls) {
    var row = document.createElement('div');
    if (cls) row.className = cls;
    row.textContent = text;
    output.appendChild(row);
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(raw) {
    var input_ = raw.trim();
    if (!input_) return;
    println(input_, 'echoed');
    history.push(input_);
    historyIndex = history.length;

    var parts = input_.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        println('commands: help, ls, cd <page>, whoami, banner, discord, date, clear, echo <text>');
        println('pages: home, projects, about, connect');
        break;
      case 'ls':
        println(Object.keys(pages).join('   '));
        break;
      case 'cd':
        var target = arg.replace('~/', '').replace('/', '');
        if (pages[target]) {
          println('→ ' + pages[target]);
          setTimeout(function () { window.location.href = pages[target]; }, 200);
        } else if (!target) {
          println('cd: missing operand. try: cd projects');
        } else {
          println('cd: no such page: ' + target);
        }
        break;
      case 'whoami':
        println('soggal1ng  (aka syfux)');
        break;
      case 'banner':
        println('  ___  ___   __ _  __ _   __ _ | | / |_ _  _  __ _ ');
        println(' / __|/ _ \\ / _` |/ _` | / _` || | | | | \\| |/ _` |');
        println(' \\__ \\ (_) | (_| | (_| || (_| || | | | |  ` | (_| |');
        println(' |___/\\___/ \\__, |\\__, | \\__,_||_| |_|_|\\__|\\__, |');
        println('            |___/ |___/                     |___/ ');
        break;
      case 'discord':
        println('opening discord.gg/29uepW58st ...');
        window.open('https://discord.gg/29uepW58st', '_blank', 'noopener');
        break;
      case 'date':
        println(new Date().toString());
        break;
      case 'clear':
        output.innerHTML = '';
        break;
      case 'echo':
        println(arg || '');
        break;
      case 'sudo':
        println('nice try. this terminal has no root. (but antos does.)');
        break;
      case 'coffee':
      case 'sandwich':
        println('brewing... still faster than the antos build.');
        break;
      default:
        println(cmd + ': command not found. try "help"');
    }
  }

  toggle.addEventListener('click', function () {
    var collapsed = bar.getAttribute('data-collapsed') === 'true';
    bar.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
    if (collapsed) input.focus();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      runCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex] || '';
      } else {
        historyIndex = history.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });
})();
