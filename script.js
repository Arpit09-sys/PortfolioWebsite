/* ============================================================
   PORTFOLIO — script.js
   All interactivity: cursor, scroll animations, parallax,
   navbar, theme toggle, timeline, tilt cards.
   Pure vanilla JS — no libraries.
   ============================================================ */

(function () {
  'use strict';

  // ── Utility: Check for reduced motion preference ──
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Utility: Lerp ──
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── Utility: Clamp ──
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ── Utility: Debounce ──
  const debounce = (fn, ms = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  // ═══════════════════════════════════════════════
  // 1. PRELOADER
  // ═══════════════════════════════════════════════
  const preloader = document.querySelector('.preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    // Remove from DOM after transition
    setTimeout(() => preloader.remove(), 600);
  }

  // Hide preloader when everything is loaded
  window.addEventListener('load', () => {
    // Small delay so fonts render
    setTimeout(hidePreloader, 400);
  });

  // Fallback: hide after 3 seconds no matter what
  setTimeout(hidePreloader, 1000);

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  // ═══════════════════════════════════════════════
  // 2. HERO CHARACTER ANIMATION
  // ═══════════════════════════════════════════════
  function animateHeroText() {
    const heroTitles = document.querySelectorAll('.hero__title [data-animate-chars]');
    heroTitles.forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);

      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.textContent = char === ' ' ? '\u00A0' : char;
        // Stagger each char by 40ms, starting after 0.3s
        span.style.animationDelay = `${0.3 + i * 0.04}s`;
        el.appendChild(span);
      });
    });
  }

  animateHeroText();

  // ═══════════════════════════════════════════════
  // 2b. HERO ROLE TEXT CYCLING
  // ═══════════════════════════════════════════════
  function initRoleCycler() {
    const roleEl = document.getElementById('hero-role');
    if (!roleEl) return;

    const roles = [
      'Aspiring Software Development Engineer',
      'Java Developer',
      'Full Stack Web Developer',
      'AI Enthusiast',
      'Problem Solver',
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = false;
    let pauseTimer = null;

    function type() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        // Typing
        roleEl.textContent = current.substring(0, charIndex);
        charIndex++;

        if (charIndex > current.length) {
          // Pause at end of word
          isDeleting = true;
          pauseTimer = setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 60);
      } else {
        // Deleting
        roleEl.textContent = current.substring(0, charIndex);
        charIndex--;

        if (charIndex < 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      }
    }

    // Start cycling after initial entrance animation
    setTimeout(() => {
      isDeleting = true;
      setTimeout(type, 500);
    }, 500);
  }

  initRoleCycler();

  // ═══════════════════════════════════════════════
  // 3. CUSTOM CURSOR
  // ═══════════════════════════════════════════════
  const cursor = document.querySelector('.cursor');

  if (cursor && !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0;
    let renderX = 0, renderY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    // Hover targets
    const hoverTargets = 'a, button, .project-card, .skill-tag, .contact__link, .theme-toggle, .navbar__hamburger';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('hovering');
      }
    });

    // Smooth follow loop
    function updateCursor() {
      renderX = lerp(renderX, cursorX, 0.15);
      renderY = lerp(renderY, cursorY, 0.15);
      cursor.style.transform = `translate(${renderX - 10}px, ${renderY - 10}px)`;
      requestAnimationFrame(updateCursor);
    }

    updateCursor();
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  // ═══════════════════════════════════════════════
  // 4. NAVBAR
  // ═══════════════════════════════════════════════
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinksContainer = document.querySelector('.navbar__links');
  const navOverlay = document.querySelector('.nav-overlay');

  // Shrink on scroll
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active section highlighting
  function updateActiveSection() {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveSection();
  }, { passive: true });

  // Mobile menu
  function toggleMobileNav() {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    navOverlay.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // ═══════════════════════════════════════════════
  // 5. THEME TOGGLE
  // ═══════════════════════════════════════════════
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle?.querySelector('svg');

  const sunPath = 'M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-5.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z';
  const moonPath = 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      const path = themeIcon.querySelector('path');
      if (path) {
        path.setAttribute('d', theme === 'dark' ? moonPath : sunPath);
      }
    }
  }

  // Init theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ═══════════════════════════════════════════════
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════════
  function initScrollReveal() {
    if (prefersReducedMotion()) return;

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Stagger children
    const staggerContainers = document.querySelectorAll('.stagger-children');

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            [...children].forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.08}s`;
            });
            entry.target.classList.add('visible');
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    staggerContainers.forEach((el) => staggerObserver.observe(el));
  }

  initScrollReveal();

  // ═══════════════════════════════════════════════
  // 7. PARALLAX EFFECTS
  // ═══════════════════════════════════════════════
  function initParallax() {
    if (prefersReducedMotion()) return;

    const heroBg = document.querySelector('.hero__bg');
    const heroOrb = document.querySelector('.hero__bg-orb');

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // Parallax hero background
        if (heroBg && scrollY < vh) {
          const factor = scrollY * 0.3;
          heroBg.style.transform = `translateY(${factor}px)`;
        }

        // Parallax orb
        if (heroOrb && scrollY < vh) {
          const factor = scrollY * 0.15;
          heroOrb.style.transform = `translate(-50%, calc(-50% + ${factor}px))`;
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  initParallax();

  // ═══════════════════════════════════════════════
  // 8. SCROLL-LINKED SECTION OPACITY / SCALE
  // ═══════════════════════════════════════════════
  function initSectionTransitions() {
    if (prefersReducedMotion()) return;

    const transitionSections = document.querySelectorAll('.section-transition');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const el = entry.target;

          // Scale from 0.96 to 1 and opacity from 0.3 to 1
          const scale = lerp(0.96, 1, ratio);
          const opacity = lerp(0.3, 1, Math.min(ratio * 2, 1));

          el.style.transform = `scale(${scale})`;
          el.style.opacity = opacity;
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    transitionSections.forEach((el) => sectionObserver.observe(el));
  }

  initSectionTransitions();

  // ═══════════════════════════════════════════════
  // 9. PROJECT CARD TILT EFFECT
  // ═══════════════════════════════════════════════
  function initCardTilt() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  initCardTilt();

  // ═══════════════════════════════════════════════
  // 10. TIMELINE SCROLL PROGRESS
  // ═══════════════════════════════════════════════
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    const progressBar = document.querySelector('.timeline__progress');
    const timelineItems = document.querySelectorAll('.timeline__item');

    if (!timeline || !progressBar) return;

    function updateTimeline() {
      const rect = timeline.getBoundingClientRect();
      const timelineTop = rect.top + window.scrollY;
      const timelineHeight = rect.height;
      const scrollPos = window.scrollY + window.innerHeight * 0.5;
      const progress = clamp((scrollPos - timelineTop) / timelineHeight, 0, 1);

      progressBar.style.height = `${progress * 100}%`;

      // Activate items
      timelineItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemMid = itemRect.top + itemRect.height / 2;

        if (itemMid < window.innerHeight * 0.6) {
          item.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline(); // Initial call
  }

  initTimeline();

  // ═══════════════════════════════════════════════
  // 11. MAGNETIC HOVER ON BUTTONS
  // ═══════════════════════════════════════════════
  function initMagneticButtons() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const magneticEls = document.querySelectorAll('.btn, .contact__link, .footer__social, .theme-toggle');

    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  initMagneticButtons();

  // ═══════════════════════════════════════════════
  // 12. CONTACT FORM (mailto fallback)
  // ═══════════════════════════════════════════════
  const contactForm = document.querySelector('.contact__form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]')?.value || '';
      const email = contactForm.querySelector('[name="email"]')?.value || '';
      const message = contactForm.querySelector('[name="message"]')?.value || '';

      const mailtoLink = `mailto:arpitsharma.asuc@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

      window.location.href = mailtoLink;
    });
  }

  // ═══════════════════════════════════════════════
  // 13. SMOOTH SCROLL (enhanced for Safari)
  // ═══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });

  // ═══════════════════════════════════════════════
  // 14. HERO SCROLL FADE
  // ═══════════════════════════════════════════════
  function initHeroScrollFade() {
    if (prefersReducedMotion()) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    function onScroll() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const fadeStart = vh * 0.15;
      const fadeEnd = vh * 0.7;

      if (scrollY < fadeEnd) {
        const progress = clamp((scrollY - fadeStart) / (fadeEnd - fadeStart), 0, 1);
        const opacity = 1 - progress;
        const scale = lerp(1, 0.95, progress);
        const translateY = scrollY * 0.15;

        hero.style.opacity = opacity;
        hero.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  initHeroScrollFade();

  // ═══════════════════════════════════════════════
  // 15. COUNTER ANIMATION (for stats)
  // ═══════════════════════════════════════════════
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1500;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              el.textContent = current + suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }

            requestAnimationFrame(update);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  initCounters();

  // ═══════════════════════════════════════════════
  // 16. YEAR IN FOOTER
  // ═══════════════════════════════════════════════
  const yearEl = document.querySelector('.footer__year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
