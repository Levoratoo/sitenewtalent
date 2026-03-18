/* ============================================================
   NEW TALENT – Escola de DJ · main.js
   Funcionalidades: navbar scroll, menu mobile,
   smooth scroll, partículas canvas, scroll animations
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. NAVBAR – comportamento ao rolar ─────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // estado inicial

  /* ── 2. ACTIVE LINK – destaca seção atual no menu ──────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ── 3. MOBILE MENU ─────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (mobileMenu.classList.contains('open') && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  /* ── 4. SMOOTH SCROLL – para links âncora ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 5. SCROLL ANIMATIONS – Intersection Observer ───────── */
  const animatedEls = document.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedEls.forEach(el => observer.observe(el));

  /* ── 6. CANVAS PARTÍCULAS – hero background ─────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Cores das partículas (compatíveis com a paleta da marca)
  const COLORS = [
    'rgba(167, 139, 250, {a})',  // purple-light
    'rgba(96,  165, 250, {a})',  // blue-light
    'rgba(244, 114, 182, {a})',  // magenta-light
  ];

  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((W * H) / 14000), 90);
    particles = [];

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        size:  Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.45 + 0.15,
        color,
      });
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color.replace('{a}', p.alpha);
    ctx.fill();
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[j].x - particles[i].x;
        const dy   = particles[j].y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = 0.12 * (1 - dist / maxDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(drawParticle);
  }

  function loop() {
    update();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  // Init
  resize();
  createParticles();
  loop();

  // Resize handler com debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      resize();
      createParticles();
      loop();
    }, 200);
  });

  // Pausa animação quando aba não está visível (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      loop();
    }
  });

  /* ── 7. CONTADOR ANIMADO – hero stats ────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    const start     = performance.now();
    const isDecimal = target % 1 !== 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value    = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Observa os stat values e dispara contagem quando visíveis
  const statValues = document.querySelectorAll('.stat-value');

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el   = entry.target;
        const text = el.textContent.trim();

        // Parseia valor e sufixo
        const match = text.match(/^([\d.]+)(.*)$/);
        if (!match) return;

        const num    = parseFloat(match[1]);
        const suffix = match[2];

        animateCounter(el, num, suffix, 1200);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.8 }
  );

  statValues.forEach(el => statsObserver.observe(el));

  /* ── 8. PARALLAX SUAVE – orbs de fundo ──────────────────── */
  const orbs = document.querySelectorAll('.hero-orb');

  window.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return; // desativa no mobile

    const xFactor = (e.clientX / window.innerWidth  - 0.5) * 20;
    const yFactor = (e.clientY / window.innerHeight - 0.5) * 20;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.4;
      orb.style.transform = `translate(${xFactor * depth}px, ${yFactor * depth}px)`;
    });
  }, { passive: true });

})();
