/* =========================================================
   FRANKENSTEIN TRIKES — MAIN JS
   Kleos Design Studio · April 2026
   ========================================================= */
(function () {
  'use strict';

  // Signal JS is live (CSS uses .js-ready scoping)
  document.documentElement.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
     REVEAL ON SCROLL (with grid staggering)
     ----------------------------------------------------- */
  // Exposed globally so page-specific scripts (trike-kits, gallery, etc.)
  // can re-run observation after injecting content.
  const STAGGER_SELECTORS = [
    '.kit-grid',
    '.gallery-grid',
    '.pricing-grid',
    '.pdf-links',
    '.tip-list',
    '.dealer-list',
    '.pillars',
    '.stats',
    '.gateway',
    '.specs',
    '.submodels',
    '.faq-list',
    '.contact-strip',
    '.admin-grid'
  ].join(',');

  const PLACEHOLDER_SELECTOR = '.kit-grid__empty, .dealer-empty, .admin-empty, .admin-table__loading, .admin-table__empty, .admin-grid__loading, .admin-grid__empty';

  function applyStagger(root) {
    const scope = root || document;
    const containers = [];
    // Include the root itself if it matches.
    if (scope.nodeType === 1 && scope.matches && scope.matches(STAGGER_SELECTORS)) {
      containers.push(scope);
    }
    scope.querySelectorAll(STAGGER_SELECTORS).forEach(c => containers.push(c));

    containers.forEach(container => {
      const children = container.children;
      let visibleIndex = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.dataset.staggered) { visibleIndex++; continue; }
        if (child.matches(PLACEHOLDER_SELECTOR)) continue;
        if (!child.classList.contains('reveal')) {
          child.classList.add('reveal');
        }
        child.style.transitionDelay = (visibleIndex * 50) + 'ms';
        child.dataset.staggered = 'true';
        visibleIndex++;
      }
    });
  }

  function observeReveals(root) {
    const scope = root || document;
    const list = [];
    if (scope.nodeType === 1 && scope.matches && scope.matches('.reveal:not(.is-visible)')) {
      list.push(scope);
    }
    scope.querySelectorAll('.reveal:not(.is-visible)').forEach(el => list.push(el));
    const reveals = list;
    if (!reveals.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  }

  // Expose helpers to page scripts.
  window.FrankReveal = {
    apply: function (root) {
      applyStagger(root);
      observeReveals(root);
    },
    applyStagger: applyStagger,
    observe: observeReveals
  };

  applyStagger(document);
  observeReveals(document);

  /* -----------------------------------------------------
     HERO HEADLINE — Word-by-word reveal on load
     ----------------------------------------------------- */
  const heroHeadline = document.querySelector('.hero__headline');
  if (heroHeadline && !heroHeadline.dataset.wordSplit) {
    // Split text nodes into per-word spans while preserving <br> tags.
    const frag = document.createDocumentFragment();
    let wordIndex = 0;
    Array.from(heroHeadline.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(piece => {
          if (!piece) return;
          if (/^\s+$/.test(piece)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word__inner';
          inner.textContent = piece;
          inner.style.transitionDelay = (wordIndex * 90) + 'ms';
          outer.appendChild(inner);
          frag.appendChild(outer);
          wordIndex++;
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    heroHeadline.innerHTML = '';
    heroHeadline.appendChild(frag);
    heroHeadline.dataset.wordSplit = 'true';
    // Trigger on next frame so transition animates.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroHeadline.classList.add('is-revealed'));
    });
  }

  /* -----------------------------------------------------
     PARALLAX — subtle fixed-background on desktop only
     ----------------------------------------------------- */
  // Only honor parallax when the viewport is wide enough and motion is allowed.
  // CSS handles the `background-attachment: fixed` toggle via a body class.
  function updateParallaxMode() {
    const wide = window.matchMedia('(min-width: 901px)').matches;
    document.body.classList.toggle('parallax-enabled', wide && !prefersReducedMotion);
  }
  updateParallaxMode();
  window.addEventListener('resize', updateParallaxMode);

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
