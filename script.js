/* =========================================================
   STORYTELLING PORTFOLIO — script.js
   Custom cursor, scroll reveal, counter animation,
   nav scroll effects, mobile menu, skill bars
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     PAGE LOAD TRANSITION
  --------------------------------------------------------- */
  window.addEventListener('load', () => {
    const overlay = document.getElementById('pageOverlay');
    if (overlay) {
      setTimeout(() => overlay.classList.add('hidden'), 100);
    }
    // Trigger hero animations
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  });

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Lagging ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor state changes
  function setCursorState(state) {
    document.body.className = document.body.className
      .replace(/cursor-\S+/g, '').trim();
    if (state) document.body.classList.add('cursor-' + state);
  }

  document.querySelectorAll('[data-cursor]').forEach(el => {
    const state = el.getAttribute('data-cursor');
    el.addEventListener('mouseenter', () => setCursorState(state));
    el.addEventListener('mouseleave', () => setCursorState(''));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  /* ---------------------------------------------------------
     NAVIGATION — scroll behaviour & mobile toggle
  --------------------------------------------------------- */
  const nav     = document.getElementById('mainNav');
  const toggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen  = false;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ---------------------------------------------------------
     ACTIVE NAV LINK on scroll
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--text)'
        : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------------------------------------------------------
     SCROLL REVEAL — Intersection Observer
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach(el => {
    // Skip hero elements (handled on load)
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  /* ---------------------------------------------------------
     SKILL BAR ANIMATION — trigger when visible
  --------------------------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillCards.forEach(card => skillObserver.observe(card));

  /* ---------------------------------------------------------
     COUNTER ANIMATION
  --------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------
     PARALLAX — hero blobs follow mouse (subtle)
  --------------------------------------------------------- */
  const blobs = document.querySelectorAll('.hero-blob');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 12;
      blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });

  /* ---------------------------------------------------------
     TILT EFFECT on project cards & skill cards
  --------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.project-card, .skill-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -6;
      const tiltY = dx *  6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------------------------------------------------------
     SMOOTH ANCHOR SCROLL (polyfill for Safari old)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------------------------------------------------------
     TIMELINE DOT ANIMATE on scroll
  --------------------------------------------------------- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const tlObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          tlObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  timelineItems.forEach(item => tlObserver.observe(item));

  console.log('%c✦ Portfolio loaded — crafted with ♥', 'color: #7c5cfc; font-size: 14px; font-weight: bold;');
})();
