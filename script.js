/* ============================================================
   PORTFOLIO — script.js
   EXTRAORDINARY EDITION
   Particles, cursor trail, holographic cards, smooth animations,
   and premium interactions. Pure vanilla JS.
   ============================================================ */

(function () {
  'use strict';

  // ── Utilities ──
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ═══════════════════════════════════════════════
  // 1. PRELOADER
  // ═══════════════════════════════════════════════
  const preloader = document.querySelector('.preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => preloader.remove(), 800);
  }

  window.addEventListener('load', () => setTimeout(hidePreloader, 600));
  setTimeout(hidePreloader, 2000);
  document.body.style.overflow = 'hidden';

  // ═══════════════════════════════════════════════
  // 2. FLOATING PARTICLES SYSTEM
  // ═══════════════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = 250 + Math.random() * 60; // purple to blue range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction — gentle push
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 0.8;
          this.y -= (dy / dist) * force * 0.8;
        }

        // Wrap around
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles — adaptive count
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(250, 60%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    animate();
  }

  initParticles();

  // ═══════════════════════════════════════════════
  // 3. HERO CHARACTER ANIMATION
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
        span.style.animationDelay = `${0.3 + i * 0.04}s`;
        el.appendChild(span);
      });
    });
  }
  animateHeroText();

  // ═══════════════════════════════════════════════
  // 4. HERO ROLE TEXT CYCLING
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

    function type() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        roleEl.textContent = current.substring(0, charIndex);
        charIndex++;
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 60);
      } else {
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

    setTimeout(() => {
      isDeleting = true;
      setTimeout(type, 500);
    }, 500);
  }
  initRoleCycler();

  // ═══════════════════════════════════════════════
  // 5. CUSTOM CURSOR + TRAIL
  // ═══════════════════════════════════════════════
  const cursor = document.querySelector('.cursor');
  const cursorTrail = document.querySelector('.cursor-trail');

  if (cursor && cursorTrail && !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0;
    let renderX = 0, renderY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    const hoverTargets = 'a, button, .project-card, .skill-tag, .contact__link, .theme-toggle, .navbar__hamburger, .profile-card';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add('hovering');
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove('hovering');
    });

    function updateCursor() {
      renderX = lerp(renderX, cursorX, 0.12);
      renderY = lerp(renderY, cursorY, 0.12);
      cursor.style.transform = `translate(${renderX - 20}px, ${renderY - 20}px)`;

      // Trail follows slower
      trailX = lerp(trailX, cursorX, 0.08);
      trailY = lerp(trailY, cursorY, 0.08);
      cursorTrail.style.transform = `translate(${trailX - 4}px, ${trailY - 4}px)`;

      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  } else {
    if (cursor) cursor.style.display = 'none';
    if (cursorTrail) cursorTrail.style.display = 'none';
  }

  // ═══════════════════════════════════════════════
  // 6. NAVBAR
  // ═══════════════════════════════════════════════
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinksContainer = document.querySelector('.navbar__links');
  const navOverlay = document.querySelector('.nav-overlay');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

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

  if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', toggleMobileNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) toggleMobileNav();
    });
  });

  // ═══════════════════════════════════════════════
  // 7. THEME TOGGLE
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
      if (path) path.setAttribute('d', theme === 'dark' ? moonPath : sunPath);
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ═══════════════════════════════════════════════
  // 8. SCROLL REVEAL
  // ═══════════════════════════════════════════════
  function initScrollReveal() {
    if (prefersReducedMotion()) return;

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
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
  // 9. PARALLAX
  // ═══════════════════════════════════════════════
  function initParallax() {
    if (prefersReducedMotion()) return;

    const heroAurora = document.querySelector('.hero__aurora');
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        if (heroAurora && scrollY < vh) {
          heroAurora.style.transform = `translateY(${scrollY * 0.25}px)`;
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
  initParallax();

  // ═══════════════════════════════════════════════
  // 10. SECTION TRANSITIONS
  // ═══════════════════════════════════════════════
  function initSectionTransitions() {
    if (prefersReducedMotion()) return;

    const transitionSections = document.querySelectorAll('.section-transition');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const el = entry.target;
          const scale = lerp(0.97, 1, ratio);
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
  // 11. HOLOGRAPHIC CARD TILT + GLOW TRACKING
  // ═══════════════════════════════════════════════
  function initHolographicCards() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card[data-tilt]');

    cards.forEach((card) => {
      const glow = card.querySelector('.project-card__glow');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        // Move glow to mouse position
        if (glow) {
          glow.style.left = `${x}px`;
          glow.style.top = `${y}px`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }
  initHolographicCards();

  // ═══════════════════════════════════════════════
  // 12. TIMELINE SCROLL PROGRESS
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

      timelineItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemMid = itemRect.top + itemRect.height / 2;

        if (itemMid < window.innerHeight * 0.6) {
          item.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }
  initTimeline();

  // ═══════════════════════════════════════════════
  // 13. MAGNETIC HOVER ON BUTTONS
  // ═══════════════════════════════════════════════
  function initMagneticButtons() {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const magneticEls = document.querySelectorAll('.btn, .footer__social, .theme-toggle');

    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
  initMagneticButtons();

  // ═══════════════════════════════════════════════
  // 14. CONTACT FORM
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
  // 15. SMOOTH SCROLL
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
  // 16. HERO SCROLL FADE
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
        const translateY = scrollY * 0.12;

        hero.style.opacity = opacity;
        hero.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
  initHeroScrollFade();

  // ═══════════════════════════════════════════════
  // 17. COUNTER ANIMATION
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
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              el.textContent = current + suffix;

              if (progress < 1) requestAnimationFrame(update);
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
  // 18. YEAR IN FOOTER
  // ═══════════════════════════════════════════════
  const yearEl = document.querySelector('.footer__year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
