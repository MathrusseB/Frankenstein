/* =========================================================
   FRANKENSTEIN TRIKES — MAIN JS
   Kleos Design Studio · April 2026
   ========================================================= */
(function () {
  'use strict';

  // Signal JS is live (CSS uses .js-ready scoping)
  document.documentElement.classList.add('js-ready');

  /* -----------------------------------------------------
     NAV — Dropdown + Mobile Hamburger
     ----------------------------------------------------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Dropdown items (click on mobile, hover on desktop handled in CSS)
  const dropdownItems = document.querySelectorAll('.nav__item--has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav__link');
    if (!link) return;
    link.addEventListener('click', (e) => {
      // On mobile, toggle
      if (window.matchMedia('(max-width: 1024px)').matches) {
        e.preventDefault();
        const wasOpen = item.classList.contains('is-open');
        // close siblings
        dropdownItems.forEach(i => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
      }
    });
  });

  // Close dropdowns when clicking outside (desktop)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--has-dropdown')) {
      dropdownItems.forEach(i => i.classList.remove('is-open'));
    }
  });

  /* -----------------------------------------------------
     REVEAL ON SCROLL
     ----------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------
     MARQUEE — Duplicate track for seamless loop
     ----------------------------------------------------- */
  const marqueeTracks = document.querySelectorAll('.marquee__track');
  marqueeTracks.forEach(track => {
    if (track.dataset.cloned) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.cloned = 'true';
  });

  /* -----------------------------------------------------
     ACTIVE NAV LINK
     ----------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('is-active');
  });
})();
