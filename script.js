/* Tony Duong — portfolio interactions & rendering (vanilla JS, no build). */
(function () {
  'use strict';

  /* ---------- i18n static strings (data-i18n) ---------- */
  var I18N = {
    fr: {
      'nav.about': 'Profil', 'nav.skills': 'Compétences', 'nav.experience': 'Expérience',
      'nav.projects': 'Projets', 'nav.education': 'Formation', 'nav.contact': 'Contact',
      'cta.projects': 'Voir les projets', 'cta.contact': 'Me contacter',
      'projects.more': 'Tout le code public sur', 'projects.repos': 'dépôts',
      'edu.degrees': 'Diplômes', 'edu.teaching': 'Enseignement', 'edu.languages': 'Langues',
      'contact.title': 'Construisons quelque chose.',
      'contact.sub': 'Disponible pour des projets fullstack, IA et Web3. Écris-moi.',
      'footer.built': 'Conçu & codé sur mesure', 'footer.source': 'Source'
    },
    en: {
      'nav.about': 'About', 'nav.skills': 'Skills', 'nav.experience': 'Experience',
      'nav.projects': 'Projects', 'nav.education': 'Education', 'nav.contact': 'Contact',
      'cta.projects': 'View projects', 'cta.contact': 'Get in touch',
      'projects.more': 'All public code on', 'projects.repos': 'repos',
      'edu.degrees': 'Degrees', 'edu.teaching': 'Teaching', 'edu.languages': 'Languages',
      'contact.title': "Let's build something.",
      'contact.sub': 'Available for fullstack, AI and Web3 work. Drop me a line.',
      'footer.built': 'Custom designed & coded', 'footer.source': 'Source'
    }
  };

  var NAV = [
    { id: 'about', key: 'nav.about', idx: '01' },
    { id: 'skills', key: 'nav.skills', idx: '02' },
    { id: 'experience', key: 'nav.experience', idx: '03' },
    { id: 'projects', key: 'nav.projects', idx: '04' },
    { id: 'education', key: 'nav.education', idx: '05' },
    { id: 'contact', key: 'nav.contact', idx: '06' }
  ];

  var ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M7 17 17 7M8 7h9v9"/></svg>'
  };

  var DATA = null;
  var lang = localStorage.getItem('lang') || (navigator.language || 'fr').slice(0, 2);
  if (lang !== 'en') lang = 'fr';

  function t(field) { return field && typeof field === 'object' ? (field[lang] || field.fr) : field; }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function $(s) { return document.querySelector(s); }

  /* ---------- render everything ---------- */
  function render() {
    renderStaticI18n();
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderTimeline();
    renderFilters();
    renderProjects('all');
    renderEducation();
    renderContact();
    $('#year').textContent = '2026';
    document.documentElement.lang = lang;
    document.body.setAttribute('data-lang', lang);
  }

  function renderStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (n) {
      var s = I18N[lang][n.getAttribute('data-i18n')];
      if (s) n.textContent = s;
    });
  }

  function renderNav() {
    var nav = $('#nav'); nav.innerHTML = '';
    NAV.forEach(function (item) {
      var a = el('a', null, '<span class="idx">' + item.idx + '</span>' + I18N[lang][item.key]);
      a.href = '#' + item.id;
      a.setAttribute('data-scroll', '');
      a.dataset.target = item.id;
      nav.appendChild(a);
    });
  }

  function renderHero() {
    var p = DATA.profile;
    $('#hero-role').textContent = t(p.role);
    $('#hero-exp').textContent = t(p.experience);
    // split name -> last word gets the gradient
    var parts = p.name.split(' ');
    var last = parts.pop();
    $('#hero-name').innerHTML = parts.join(' ') + ' <span class="grad">' + last + '</span>';
    $('#hero-tagline').textContent = t(p.tagline);
    var links = $('#hero-links'); links.innerHTML = '';
    var L = [
      { icon: 'github', label: 'GitHub', url: 'https://github.com/astowny' },
      { icon: 'mail', label: p.email, url: 'mailto:' + p.email },
      { icon: 'phone', label: p.phone, url: 'tel:' + p.phone.replace(/\s/g, '') },
      { icon: 'pin', label: t(p.location), url: 'https://maps.google.com/?q=Bordeaux' }
    ];
    L.forEach(function (l) {
      var a = el('a', null, ICONS[l.icon] + '<span>' + l.label + '</span>');
      a.href = l.url;
      if (l.url.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      links.appendChild(a);
    });
  }

  function renderAbout() {
    $('#about-text').textContent = t(DATA.about);
    var s = $('#stats'); s.innerHTML = ''; s.classList.add('reveal-child');
    DATA.stats.forEach(function (st) {
      s.appendChild(el('div', 'stat', '<div class="val">' + st.value + '</div><div class="lbl">' + t(st.label) + '</div>'));
    });
  }

  function renderSkills() {
    var g = $('#skills-grid'); g.innerHTML = ''; g.classList.add('reveal-child');
    DATA.skills.forEach(function (group) {
      var card = el('div', 'skill-card');
      card.appendChild(el('h3', null, t(group.category)));
      var chips = el('div', 'chips');
      group.items.forEach(function (it) { chips.appendChild(el('span', 'chip', it)); });
      card.appendChild(chips);
      g.appendChild(card);
    });
  }

  function renderTimeline() {
    var tl = $('#timeline'); tl.innerHTML = '';
    DATA.experience.forEach(function (job) {
      var item = el('div', 'tl-item reveal' + (job.current ? ' current' : ''));
      var head = el('div', 'tl-head');
      head.innerHTML = '<span class="tl-role">' + t(job.role) + '</span>' +
        '<span class="tl-company">' + job.company + '</span>' +
        (job.current ? '<span class="tl-badge">●</span>' : '') +
        '<span class="tl-period">' + t(job.period) + '</span>';
      item.appendChild(head);
      var ul = el('ul', 'tl-bullets');
      t(job.bullets).forEach(function (b) { ul.appendChild(el('li', null, b)); });
      item.appendChild(ul);
      var tags = el('div', 'tl-tags');
      job.tags.forEach(function (tg) { tags.appendChild(el('span', null, tg)); });
      item.appendChild(tags);
      tl.appendChild(item);
    });
  }

  function renderFilters() {
    var f = $('#filters'); f.innerHTML = '';
    DATA.projectFilters.forEach(function (flt, i) {
      var b = el('button', 'filter-btn' + (i === 0 ? ' active' : ''), t(flt.label));
      b.type = 'button';
      b.dataset.filter = flt.id;
      b.addEventListener('click', function () {
        f.querySelectorAll('.filter-btn').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        renderProjects(flt.id);
      });
      f.appendChild(b);
    });
  }

  function isLive(pr) {
    return !!(pr.links && pr.links.some(function (l) { return /live/i.test(l.label); }));
  }

  function renderProjects(filter) {
    var g = $('#projects-grid'); g.innerHTML = '';
    // surface live work first, then flagships — keep original order otherwise
    var ordered = DATA.projects
      .map(function (pr, i) { return { pr: pr, i: i, rank: (isLive(pr) ? 2 : 0) + (pr.featured ? 1 : 0) }; })
      .sort(function (a, b) { return b.rank - a.rank || a.i - b.i; })
      .map(function (o) { return o.pr; });

    ordered.forEach(function (pr) {
      var live = isLive(pr);
      var match = filter === 'all' ||
        (filter === 'featured' ? pr.featured : filter === 'live' ? live : pr.category === filter);
      if (!match) return;
      var card = el('div', 'project reveal' + (pr.featured ? ' featured' : '') + (live ? ' is-live' : ''));
      var top = el('div', 'project-top');
      var badge = live
        ? '<span class="project-live">● ' + (lang === 'fr' ? 'EN LIGNE' : 'LIVE') + '</span>'
        : (pr.featured ? '<span class="project-star">★ ' + (lang === 'fr' ? 'PHARE' : 'FLAGSHIP') + '</span>' : '');
      top.innerHTML = '<span class="project-name">' + pr.name + '</span>' + badge;
      card.appendChild(top);
      if (pr.tagline) card.appendChild(el('div', 'project-tagline', t(pr.tagline)));
      card.appendChild(el('p', 'project-desc', t(pr.description)));
      var tags = el('div', 'project-tags');
      pr.tags.forEach(function (tg) { tags.appendChild(el('span', null, tg)); });
      card.appendChild(tags);
      if (pr.links && pr.links.length) {
        var lk = el('div', 'project-links');
        pr.links.forEach(function (l) {
          var isLive = /live/i.test(l.label);
          var a = el('a', isLive ? 'live' : null, l.label + ' ' + ICONS.ext);
          a.href = l.url; a.target = '_blank'; a.rel = 'noopener';
          lk.appendChild(a);
        });
        card.appendChild(lk);
      }
      // cursor spotlight
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      g.appendChild(card);
    });
    observeReveals();
  }

  function renderEducation() {
    var list = $('#education-list'); list.innerHTML = '';
    DATA.education.forEach(function (e) {
      list.appendChild(el('div', 'edu-item',
        '<h4>' + t(e.title) + '</h4><div class="school">' + e.school + '</div>' +
        '<div class="detail">' + t(e.detail) + '</div>'));
    });
    var teach = $('#teaching-list'); teach.innerHTML = '';
    t(DATA.teaching).forEach(function (line) { teach.appendChild(el('li', null, line)); });
    var langs = $('#languages-list'); langs.innerHTML = '';
    DATA.languages.forEach(function (l) {
      var item = el('div', 'lang-item',
        '<div class="lang-head"><span>' + t(l.name) + '</span><span class="lvl">' + t(l.level) + '</span></div>' +
        '<div class="lang-bar"><i data-w="' + l.value + '"></i></div>');
      langs.appendChild(item);
    });
  }

  function renderContact() {
    var p = DATA.profile;
    var c = $('#contact-actions'); c.innerHTML = '';
    var btns = [
      { cls: 'btn btn-primary', label: p.email, url: 'mailto:' + p.email, icon: 'mail' },
      { cls: 'btn btn-ghost', label: 'GitHub', url: 'https://github.com/astowny', icon: 'github' },
      { cls: 'btn btn-ghost', label: p.phone, url: 'tel:' + p.phone.replace(/\s/g, ''), icon: 'phone' }
    ];
    btns.forEach(function (b) {
      var a = el('a', b.cls, ICONS[b.icon] + '<span>' + b.label + '</span>');
      a.href = b.url;
      if (b.url.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      c.appendChild(a);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealObs;
  function observeReveals() {
    if (!revealObs) {
      revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            // animate language bars when visible
            if (en.target.querySelectorAll) {
              en.target.querySelectorAll('.lang-bar i').forEach(function (i) {
                i.style.width = i.dataset.w + '%';
              });
            }
            revealObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }
    document.querySelectorAll('.reveal:not(.in), .reveal-child:not(.in)').forEach(function (n) {
      revealObs.observe(n);
    });
    // language bars live in education; observe the section to trigger fill
    var lb = $('#education');
    if (lb) revealObs.observe(lb);
  }

  /* ---------- scroll spy + progress + topbar ---------- */
  function initScroll() {
    var topbar = $('#topbar');
    var prog = $('#scroll-progress');
    var navLinks = function () { return document.querySelectorAll('#nav a'); };
    var sections = NAV.map(function (n) { return document.getElementById(n.id); });

    function onScroll() {
      var y = window.scrollY;
      topbar.classList.toggle('scrolled', y > 30);
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      var current = '';
      sections.forEach(function (s) {
        if (s && s.getBoundingClientRect().top <= innerHeight * 0.4) current = s.id;
      });
      navLinks().forEach(function (a) { a.classList.toggle('active', a.dataset.target === current); });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- smooth scroll for in-page links ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-scroll]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id && id.charAt(0) === '#' && id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMenu();
        }
      }
    });
  }

  /* ---------- mobile menu ---------- */
  function closeMenu() {
    $('#nav').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
  }
  function initMenu() {
    var btn = $('#menu-toggle');
    btn.addEventListener('click', function () {
      var open = $('#nav').classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- language toggle ---------- */
  function initLang() {
    $('#lang-toggle').addEventListener('click', function () {
      lang = lang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('lang', lang);
      render();
      // re-mark already-visible reveals as in (avoid blank flash on re-render)
      requestAnimationFrame(function () {
        document.querySelectorAll('.reveal, .reveal-child').forEach(function (n) {
          var r = n.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) {
            n.classList.add('in');
            if (n.querySelectorAll) n.querySelectorAll('.lang-bar i').forEach(function (i) { i.style.width = i.dataset.w + '%'; });
          }
        });
        observeReveals();
      });
    });
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (matchMedia('(hover: none)').matches) return;
    var cur = $('#cursor');
    // follow the pointer 1:1 — no smoothing, no transition (felt laggy otherwise)
    addEventListener('pointermove', function (e) {
      cur.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      if (e.target.closest('a, button, .chip, .stat, .project, .skill-card')) cur.classList.add('hover');
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest('a, button, .chip, .stat, .project, .skill-card')) cur.classList.remove('hover');
    });
  }

  /* ---------- boot ---------- */
  function boot(data) {
    DATA = data;
    render();
    initScroll();
    initSmoothScroll();
    initMenu();
    initLang();
    initCursor();
    observeReveals();
    // mark above-the-fold hero reveals immediately
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero .reveal').forEach(function (n) { n.classList.add('in'); });
    });
  }

  fetch('data.json')
    .then(function (r) { return r.json(); })
    .then(boot)
    .catch(function (err) {
      console.error('Failed to load data.json', err);
      document.querySelector('main').insertAdjacentHTML('afterbegin',
        '<p style="padding:120px 20px;text-align:center;color:#8ba7a2">Impossible de charger les données. Lance le site via un serveur HTTP (pas en file://).</p>');
    });
})();
