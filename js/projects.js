(function () {
  var PROJECTS = [
    {
      id: 'antos',
      name: 'AntOS',
      tagline: 'A custom Linux distro, built from a Debian base up.',
      status: 'active build · v2.3',
      tags: ['systems'],
      tagLabels: ['Linux', 'Debian 12', 'Bash', 'GRUB'],
      body: [
        'A Linux distribution built on top of Debian 12 "Bookworm", assembled by hand rather than forked from an existing spin. Currently at version 2.3, with a working ISO that boots, installs, and sets up GRUB cleanly inside a VirtualBox test environment.',
        'Development happens inside WSL, with every build tested in a VM before it ever touches real hardware.'
      ],
      points: [
        'Custom XFCE-based desktop image, built and tested end-to-end',
        'Planned: wifi support out of the box',
        'Planned: dual-boot install on MBR disks without wiping an existing Windows partition',
        'A quiet homage to Terry A. Davis baked in as a hidden credit'
      ]
    },
    {
      id: 'homeserver',
      name: 'Home Server',
      tagline: 'An old, underpowered laptop, turned into a real homelab.',
      status: 'running 24/7',
      tags: ['systems', 'self-hosted'],
      tagLabels: ['Linux', 'Docker', 'C# / .NET', 'Tailscale'],
      body: [
        'A retired Ubuntu laptop with 4GB of RAM and nothing to prove became a headless home server, administered entirely over SSH through a Tailscale mesh network from a main machine elsewhere in the house.',
        'The stack runs on Docker Compose: Pi-hole for network-wide ad blocking, Uptime Kuma for uptime monitoring, and Homepage as a dashboard front door.'
      ],
      points: [
        'Migrated from snap Docker to official docker-ce after early instability',
        'Built a custom ASP.NET Core (.NET 6) monitoring API from scratch',
        'Live CPU, RAM and disk stats, plus Docker container health, in a self-made dashboard',
        'No off-the-shelf monitoring tool — this one only shows what actually matters here'
      ]
    },
    {
      id: 'iptv',
      name: 'Custom IPTV',
      tagline: 'Turning an owned media library into real live TV channels.',
      status: 'in progress',
      tags: ['self-hosted', 'apps'],
      tagLabels: ['ErsatzTV', 'Jellyfin', 'webOS', 'Docker'],
      body: [
        'Instead of paying for an IPTV subscription, this project streams an existing movie and TV library as scheduled, always-on channels — built with ErsatzTV on top of Jellyfin, and pushed to an LG webOS smart TV (with the rest of the network to follow).',
        'Custom ad breaks are woven in roughly once an hour during playback, then the show picks back up — the way real broadcast TV actually feels.'
      ],
      points: [
        'Ch. 32 — Hacker Movies',
        'Ch. 33 — Hacker TV Shows',
        'Ch. 46 — Casual Movies, shuffled with no repeats until the library cycles',
        'Ch. 47 — Casual TV Shows, one season at a time, then jumps to something different'
      ]
    },
    {
      id: 'soggacli',
      name: 'Sogga CLI',
      tagline: 'A colored ASCII terminal menu, built entirely in batch.',
      status: 'finished',
      tags: ['scripting'],
      tagLabels: ['Batch', 'CLI', 'ASCII Art'],
      body: [
        'A terminal tool written in pure batch script: a colored ASCII-art banner up top, and an interactive numbered menu underneath with fifteen selectable options.',
        'The code is deliberately split so the editable parts — labels, per-option behavior — live apart from the box-drawing and display plumbing, so adding a new option never means touching the rendering code.'
      ],
      points: [
        '15-option interactive numbered menu',
        'Color and box-drawing handled separately from menu content',
        'Has its own small Discord community built around it'
      ],
      link: { label: 'Join the Discord', url: 'https://discord.gg/29uepW58st' }
    },
    {
      id: 'usagetracker',
      name: 'Usage Tracker',
      tagline: 'Second-accurate app usage tracking, phone to server.',
      status: 'finished',
      tags: ['apps'],
      tagLabels: ['Android', 'Python', 'Flask'],
      body: [
        'An Android app paired with a local Python Flask server. The app watches the foreground app on the phone and logs exact open/close timestamps — down to the second, not a rough estimate.',
        'When tracking stops, it batches everything into one report — most recently used, most used, and least used apps — and sends it to the server in a single shot, then shuts the server down.'
      ],
      points: [
        'Switched from a 5-minute ping reminder to full per-session precision',
        'Built with Android Studio, standardized on JDK 17 after Gradle/AGP mismatches on newer JDKs',
        'Local server runs on the home network, no cloud dependency'
      ]
    },
    {
      id: 'webhook',
      name: 'Discord Webhook Notifier',
      tagline: 'Build, backup and script status, pinged straight to Discord.',
      status: 'finished',
      tags: ['scripting', 'self-hosted'],
      tagLabels: ['Batch', 'Discord API', 'Automation'],
      body: [
        'A small batch-scripted notifier that posts status updates — build finished, backup complete, script failed — directly into a Discord server via webhook, so nothing needs to be checked on manually.'
      ],
      points: [
        'Reusable across builds, backups, and one-off scripts',
        'No dashboard to check — status shows up where the rest of the chatter already is'
      ]
    },
    {
      id: 'numberguesser',
      name: 'Number Guesser',
      tagline: 'A batch-script game, and a workbench for array logic.',
      status: 'finished',
      tags: ['scripting'],
      tagLabels: ['Batch', 'Game Logic'],
      body: [
        'A number-guessing game written in batch, built right after picking up array and set-based math tricks while working on Sogga CLI — a small, self-contained way to put those tricks to use immediately.'
      ],
      points: [
        'Pure batch script, no external dependencies',
        'Built as a deliberate practice project, not a from-scratch idea'
      ]
    }
  ];

  window.SOGGA_PROJECTS = PROJECTS;

  var grid = document.getElementById('project-grid');
  if (!grid) return;

  var filters = document.querySelectorAll('.filter-btn');
  var modalBackdrop = document.getElementById('modal-backdrop');
  var modalBody = document.getElementById('modal-body');
  var modalClose = document.getElementById('modal-close');

  function render(activeTag) {
    grid.innerHTML = '';
    PROJECTS.filter(function (p) {
      return activeTag === 'all' || p.tags.indexOf(activeTag) !== -1;
    }).forEach(function (p) {
      var card = document.createElement('article');
      card.className = 'project-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');

      var tagsHtml = p.tagLabels.map(function (t) {
        return '<span class="tag">' + t + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="row1"><h3>' + p.name + '</h3><span class="stat">' + p.status + '</span></div>' +
        '<p class="tagline">' + p.tagline + '</p>' +
        '<div class="tag-row">' + tagsHtml + '</div>' +
        '<span class="open-hint">open →</span>';

      card.addEventListener('click', function () { openModal(p); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(p);
        }
      });

      grid.appendChild(card);
    });
  }

  function openModal(p) {
    var pointsHtml = p.points.map(function (pt) { return '<li>' + pt + '</li>'; }).join('');
    var bodyHtml = p.body.map(function (para) { return '<p>' + para + '</p>'; }).join('');
    var linkHtml = p.link ? '<a class="btn" href="' + p.link.url + '" target="_blank" rel="noopener">' + p.link.label + '</a>' : '';

    modalBody.innerHTML =
      '<h3>' + p.name + '</h3>' +
      '<div class="status-line">' + p.status + '</div>' +
      bodyHtml +
      '<ul>' + pointsHtml + '</ul>' +
      (linkHtml ? '<div class="mt-lg">' + linkHtml + '</div>' : '');

    modalBackdrop.setAttribute('data-open', 'true');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      render(btn.dataset.filter);
    });
  });

  render('all');
})();
