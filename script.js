/* ============================================================
   PORTFOLIO — script.js
   Simple and clean. Only essential functionality.
   ============================================================ */

(function () {
  'use strict';

  // ── 1. Navbar scroll effect ──
  var navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });

  // ── 2. Active nav link based on scroll ──
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── 3. Mobile hamburger menu ──
  var hamburger = document.getElementById('hamburger');
  var navLinksContainer = document.getElementById('nav-links');
  var navOverlay = document.getElementById('nav-overlay');

  function toggleMenu() {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    navOverlay.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
  }

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinksContainer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ── 4. Theme toggle ──
  var themeToggle = document.getElementById('theme-toggle-btn');
  var sunPath = 'M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-5.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z';
  var moonPath = 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    var path = themeToggle ? themeToggle.querySelector('svg path') : null;
    if (path) {
      path.setAttribute('d', theme === 'dark' ? moonPath : sunPath);
    }
  }

  var savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── 5. Typing effect for hero role ──
  var roleEl = document.getElementById('hero-role');

  if (roleEl) {
    var roles = [
      'Aspiring Software Development Engineer',
      'Java Developer',
      'Full Stack Web Developer',
      'AI Enthusiast',
      'Problem Solver'
    ];

    var roleIndex = 0;
    var charIndex = roles[0].length;
    var isDeleting = false;

    function type() {
      var current = roles[roleIndex];

      if (!isDeleting) {
        roleEl.textContent = current.substring(0, charIndex);
        charIndex++;
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 70);
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
        setTimeout(type, 35);
      }
    }

    // Start the typing effect after a short delay
    setTimeout(function () {
      isDeleting = true;
      setTimeout(type, 1000);
    }, 1500);
  }

  // ── 6. Smooth scrolling for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ── 7. Contact form — mailto ──
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('[name="name"]').value || '';
      var email = contactForm.querySelector('[name="email"]').value || '';
      var message = contactForm.querySelector('[name="message"]').value || '';

      var subject = 'Portfolio Contact from ' + encodeURIComponent(name);
      var body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
      var mailtoLink = 'mailto:arpitsharma.asuc@gmail.com?subject=' + subject + '&body=' + body;

      window.location.href = mailtoLink;
    });
  }

  // ── 8. Footer year ──
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
