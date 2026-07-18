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

  // ── 4. Typing effect for hero role ──
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

  // ── 5. Smooth scrolling for anchor links ──
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


  // ── 7. Footer year ──
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── 7. Console Easter Egg ──
  console.log("%cHello there!", "font-weight: bold; font-size: 20px; color: #1a73e8;");
  console.log("I see you're inspecting the code! I'm Arpit, a CSE student who loves building things.");
  console.log("If you like what you see, feel free to reach out to me.");

})();
