/* ============================================================
   OBSIDIAN PEAK HOLDINGS — MAIN JS
   ============================================================ */

// === THEME TOGGLE — site default is DARK ===
(function () {
  const html = document.documentElement;

  // Force DARK as the site default — ignore system preference.
  // data-theme="dark" is already set on <html> in default.html to prevent
  // any flash of light theme before this script runs.
  let theme = 'dark';
  html.setAttribute('data-theme', 'dark');

  const toggle = document.querySelector('[data-theme-toggle]');

  const sunSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const moonSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function applyTheme(t) {
    theme = t;
    html.setAttribute('data-theme', t);
    const isDark = t === 'dark';
    const icon = isDark ? sunSVG : moonSVG;
    const label = 'Switch to ' + (isDark ? 'light' : 'dark') + ' mode';

    if (toggle) {
      toggle.innerHTML = icon;
      toggle.setAttribute('aria-label', label);
    }

    const mobileToggle = document.querySelector('[data-theme-toggle-mobile]');
    if (mobileToggle) {
      mobileToggle.innerHTML = icon;
      mobileToggle.setAttribute('aria-label', label);
    }
  }

  // Apply on load to set the correct toggle icon/label for dark
  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
  }
})();

// === STICKY HEADER ===
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 60);
  }, { passive: true });
})();

// === MOBILE NAV ===
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.focus();
    }
  });
})();

// === SCROLL ANIMATIONS ===
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

// === FAQ ACCORDION ===
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// === CONTACT FORM ===
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Message Sent!';
    btn.style.background = 'var(--color-success)';
    btn.style.color = '#fff';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
})();

// === ANIMATED COUNTER ===
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();
