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
  function smoothScrollToTarget(target, offset = navbar.offsetHeight) {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.hasAttribute('data-unit-link')) return;

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      if (
        targetId === '#unit-detail' &&
        unitPickerSection &&
        !hasUserChosenUnit
      ) {
        e.preventDefault();
        smoothScrollToTarget(unitPickerSection, 0);
        return;
      }

      e.preventDefault();
      smoothScrollToTarget(target);
    });
  });

  /* ── 5. PRODUTOS EM ABAS ─────────────────────────────────── */
  const productTabs = document.querySelectorAll('.products-tab');
  const productPanels = document.querySelectorAll('.products-panel');

  function activateProductTab(targetId) {
    productTabs.forEach(tab => {
      const isActive = tab.dataset.tabTarget === targetId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    productPanels.forEach(panel => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('is-active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'hidden');
      }
    });
  }

  productTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tabTarget;
      if (!targetId) return;
      activateProductTab(targetId);
    });
  });

  /* ── 6. SELETOR DE UNIDADES ──────────────────────────────── */
  const unitPickerLinks = document.querySelectorAll('[data-unit-link]');
  const unitCards = document.querySelectorAll('[data-unit-card]');
  const unitPickerAtmosphere = document.querySelector('.unit-picker-atmosphere');
  const unitDetailSection = document.getElementById('unit-detail');
  const unitDetailShell = document.querySelector('.unit-detail-shell');
  const unitDetailMedia = document.querySelector('.unit-detail-media');
  const unitDetailTag = document.getElementById('unit-detail-tag');
  const unitDetailTitle = document.getElementById('unit-detail-title');
  const unitDetailLead = document.getElementById('unit-detail-lead');
  const unitDetailPills = document.getElementById('unit-detail-pills');
  const unitDetailImage = document.getElementById('unit-detail-image');
  const unitDetailBadge = document.getElementById('unit-detail-badge');
  const unitDetailCaption = document.getElementById('unit-detail-caption');
  const unitDetailSwitcher = document.getElementById('unit-detail-switcher');
  const unitDetailCta = document.getElementById('unit-detail-cta');
  const unitDetailInstagram = document.getElementById('unit-detail-instagram');
  const unitDetailSwitch = document.getElementById('unit-detail-switch');
  const unitDetailSwitchMenu = document.getElementById('unit-detail-switch-menu');
  const unitDetailSwitchOptions = document.querySelectorAll('[data-unit-detail-switch]');
  const unitDetailServices = document.getElementById('unit-detail-services');
  const unitDetailCtaHref = unitDetailCta ? unitDetailCta.getAttribute('href') : '';
  const unitDetailInstagramHref = unitDetailInstagram ? unitDetailInstagram.getAttribute('href') : '';

  const unitImagePath = (fileName, version = '') =>
    encodeURI(`foto newtalent/${fileName}${version ? `?v=${version}` : ''}`);
  const whatsappLink = phone => `https://wa.me/55${phone.replace(/\D/g, '')}`;
  const unitPickerLabels = {
    maringa: 'Maring\u00E1',
    londrina: 'Londrina',
    balneario: 'Balne\u00E1rio Cambori\u00FA'
  };
  let hasUserChosenUnit = false;
  let currentUnitKey = 'balneario';

  const unitDetails = {
    maringa: {
      accentRgb: '37, 99, 235',
      tag: 'UNIDADE MARING\u00C1 \u00B7 PR',
      title: 'Maring\u00E1 com DJ, produ\u00E7\u00E3o e loca\u00E7\u00E3o em uma s\u00F3 base.',
      lead: 'Curso de DJ, produ\u00E7\u00E3o musical e loca\u00E7\u00E3o de equipamentos reunidos em uma opera\u00E7\u00E3o feita para evolu\u00E7\u00E3o real.',
      pills: ['Curso de DJ', 'Produ\u00E7\u00E3o musical', 'Loca\u00E7\u00E3o de equipamentos'],
      image: unitImagePath('Maring\u00E1.jpg', '20260319-1154'),
      imageAlt: 'Ambiente da unidade New Talent em Maring\u00E1',
      badge: 'Maring\u00E1 \u00B7 PR',
      caption: 'Opera\u00E7\u00E3o completa para aula, produ\u00E7\u00E3o e loca\u00E7\u00E3o em Maring\u00E1.',
      cta: 'Falar com Maring\u00E1',
      ctaHref: whatsappLink('(44) 3046-6180'),
      instagramHref: 'https://www.instagram.com/newtalent_escola_dj_maringa/',
      services: [
        {
          index: '01',
          title: 'Curso de DJ',
          desc: 'Aulas pr\u00E1ticas para quem quer sair do zero, montar set com seguran\u00E7a e dominar t\u00E9cnicas de mixagem com equipamento profissional.',
          items: [
            'Do primeiro contato \u00E0 performance completa',
            'Treino com controladoras, mixers e din\u00E2mica de pista',
            'Mentoria para repert\u00F3rio, transi\u00E7\u00F5es e postura de cabine'
          ]
        },
        {
          index: '02',
          title: 'Produ\u00E7\u00E3o Musical',
          desc: 'Forma\u00E7\u00E3o para criar faixas autorais, desenvolver identidade sonora e transformar ideia em m\u00FAsica pronta para evoluir na cena.',
          items: [
            'Fluxo de DAW, arranjo e sound design',
            'Mixagem com foco em clareza e impacto',
            'Acompanhamento criativo para desenvolver assinatura musical'
          ]
        },
        {
          index: '03',
          title: 'Loca\u00E7\u00E3o de Equipamentos',
          desc: 'Solu\u00E7\u00E3o sob demanda para eventos, festas e necessidades pontuais com estrutura confi\u00E1vel e suporte para opera\u00E7\u00E3o.',
          items: [
            'Controladoras, players e mixers para diferentes setups',
            'Configura\u00E7\u00E3o conforme o perfil do evento',
            'Suporte para retirada, montagem e uso'
          ]
        }
      ]
    },
    londrina: {
      accentRgb: '59, 130, 246',
      tag: 'UNIDADE LONDRINA \u00B7 PR',
      title: 'Londrina com forma\u00E7\u00E3o pr\u00E1tica para ganhar ritmo e presen\u00E7a.',
      lead: 'A unidade combina curso de DJ, produ\u00E7\u00E3o musical e estrutura para eventos em uma rotina de evolu\u00E7\u00E3o constante.',
      pills: ['Curso de DJ', 'Produ\u00E7\u00E3o musical', 'Loca\u00E7\u00E3o de equipamentos'],
      image: unitImagePath('Londrina.jpg'),
      imageAlt: 'Ambiente da unidade New Talent em Londrina',
      badge: 'Londrina \u00B7 PR',
      caption: 'Base pensada para aulas pr\u00E1ticas, desenvolvimento de artistas e estrutura de evento.',
      cta: 'Falar com Londrina',
      ctaHref: whatsappLink('(43) 3028-4004'),
      instagramHref: 'https://www.instagram.com/newtalent_escola_dj_londrina/',
      services: [
        {
          index: '01',
          title: 'Curso de DJ',
          desc: 'Treinamento para leitura de pista, narrativa de set e seguran\u00E7a t\u00E9cnica para quem quer tocar melhor desde as primeiras aulas.',
          items: [
            'Mixagem orientada para pista e repert\u00F3rio',
            'Pr\u00E1tica guiada com equipamentos profissionais',
            'Constru\u00E7\u00E3o de identidade de set e performance'
          ]
        },
        {
          index: '02',
          title: 'Produ\u00E7\u00E3o Musical',
          desc: 'Acompanhamento para produzir com mais dire\u00E7\u00E3o, desenvolver arranjos fortes e lapidar a assinatura sonora do aluno.',
          items: [
            'Cria\u00E7\u00E3o, estrutura e refinamento de faixa',
            'Mixagem aplicada \u00E0 m\u00FAsica eletr\u00F4nica',
            'Mentoria para acelerar a tomada de decis\u00E3o'
          ]
        },
        {
          index: '03',
          title: 'Loca\u00E7\u00E3o de Equipamentos',
          desc: 'Estrutura vers\u00E1til para eventos e ativa\u00E7\u00F5es, com setups ajustados \u00E0 necessidade de cada produ\u00E7\u00E3o.',
          items: [
            'Equipamentos de DJ para eventos e ensaios',
            'Planos sob medida para dura\u00E7\u00E3o e formato',
            'Suporte t\u00E9cnico para opera\u00E7\u00E3o segura'
          ]
        }
      ]
    },
    balneario: {
      accentRgb: '14, 165, 233',
      tag: 'UNIDADE BALNE\u00C1RIO CAMBORI\u00DA \u00B7 SC',
      title: 'Balne\u00E1rio com estrutura premium para tocar e produzir.',
      lead: 'A unidade do litoral entrega pr\u00E1tica, dire\u00E7\u00E3o art\u00EDstica e ambiente profissional para quem quer acelerar em alto n\u00EDvel.',
      pills: ['Curso de DJ', 'Produ\u00E7\u00E3o musical', 'Loca\u00E7\u00E3o de equipamentos'],
      image: unitImagePath('balneario.jpg'),
      imageAlt: 'Ambiente da unidade New Talent em Balne\u00E1rio Cambori\u00FA',
      badge: 'Balne\u00E1rio Cambori\u00FA \u00B7 SC',
      caption: 'Ambiente premium para aula, produ\u00E7\u00E3o e loca\u00E7\u00E3o no litoral.',
      cta: 'Falar com Balne\u00E1rio',
      ctaHref: whatsappLink('(44) 99843-5197'),
      instagramHref: 'https://www.instagram.com/newtalent_escola_dj_balneario/',
      services: [
        {
          index: '01',
          title: 'Curso de DJ',
          desc: 'Aulas pr\u00E1ticas com foco em leitura de pista, t\u00E9cnica, repert\u00F3rio e performance para quem quer acelerar com equipamento profissional.',
          items: [
            'Treino real com setup de cabine',
            'Constru\u00E7\u00E3o de set e transi\u00E7\u00F5es',
            'Mentoria para evoluir com seguran\u00E7a'
          ]
        },
        {
          index: '02',
          title: 'Produ\u00E7\u00E3o Musical',
          desc: 'Desenvolvimento de faixas autorais com orienta\u00E7\u00E3o t\u00E9cnica, sensibilidade de pista e acabamento pensado para cena eletr\u00F4nica.',
          items: [
            'Cria\u00E7\u00E3o, arranjo e sound design',
            'Mixagem com direcionamento pr\u00E1tico',
            'Desenvolvimento de identidade sonora'
          ]
        },
        {
          index: '03',
          title: 'Loca\u00E7\u00E3o de Equipamentos',
          desc: 'Estrutura confi\u00E1vel para eventos, ativa\u00E7\u00F5es e necessidades pontuais com suporte para quem precisa operar com seguran\u00E7a.',
          items: [
            'Controladoras, players e mixers',
            'Configura\u00E7\u00F5es sob medida para o evento',
            'Suporte na retirada e opera\u00E7\u00E3o'
          ]
        }
      ]
    }
  };

  function renderUnitDetail(unitKey) {
    const unitDetail = unitDetails[unitKey];
    if (!unitDetail || !unitDetailSection) return;
    const hasImage = Boolean(unitDetail.image);

    unitDetailSection.style.setProperty('--detail-accent-rgb', unitDetail.accentRgb);
    if (unitDetailShell) {
      unitDetailShell.classList.add('visible');
      unitDetailShell.classList.toggle('is-text-only', !hasImage);
    }
    if (unitDetailMedia) {
      unitDetailMedia.hidden = !hasImage;
      unitDetailMedia.setAttribute('aria-hidden', hasImage ? 'false' : 'true');
    }

    if (unitDetailTag) unitDetailTag.textContent = unitDetail.tag;
    if (unitDetailTitle) unitDetailTitle.textContent = unitDetail.title;
    if (unitDetailLead) unitDetailLead.textContent = unitDetail.lead;
    if (unitDetailBadge) unitDetailBadge.textContent = unitDetail.badge;
    if (unitDetailCaption) unitDetailCaption.textContent = unitDetail.caption;

    if (unitDetailImage) {
      if (hasImage) {
        unitDetailImage.src = unitDetail.image;
        unitDetailImage.alt = unitDetail.imageAlt;
      } else {
        unitDetailImage.removeAttribute('src');
        unitDetailImage.alt = '';
      }
    }

    if (unitDetailCta) {
      unitDetailCta.textContent = unitDetail.cta;
      if (unitDetail.ctaHref) {
        unitDetailCta.href = unitDetail.ctaHref;
      } else if (unitDetailCtaHref) {
        unitDetailCta.href = unitDetailCtaHref;
      }
    }

    if (unitDetailInstagram) {
      if (unitDetail.instagramHref) {
        unitDetailInstagram.href = unitDetail.instagramHref;
      } else if (unitDetailInstagramHref) {
        unitDetailInstagram.href = unitDetailInstagramHref;
      }
    }

    if (unitDetailPills) {
      unitDetailPills.innerHTML = unitDetail.pills
        .map(pill => `<span class="unit-detail-pill">${pill}</span>`)
        .join('');
    }

    if (unitDetailServices) {
      unitDetailServices.innerHTML = unitDetail.services
        .map(service => `
          <article class="unit-service-card">
            <span class="unit-service-index">${service.index}</span>
            <h3 class="unit-service-title">${service.title}</h3>
            <p class="unit-service-desc">${service.desc}</p>
            <ul class="unit-service-list">
              ${service.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </article>
        `)
        .join('');
    }
  }

  function closeUnitDetailSwitchMenu() {
    if (!unitDetailSwitch || !unitDetailSwitchMenu || !unitDetailSwitcher) return;
    unitDetailSwitch.setAttribute('aria-expanded', 'false');
    unitDetailSwitchMenu.hidden = true;
    unitDetailSwitcher.classList.remove('is-open');
  }

  function openUnitDetailSwitchMenu() {
    if (!unitDetailSwitch || !unitDetailSwitchMenu || !unitDetailSwitcher) return;
    unitDetailSwitch.setAttribute('aria-expanded', 'true');
    unitDetailSwitchMenu.hidden = false;
    unitDetailSwitcher.classList.add('is-open');
  }

  function syncUnitDetailSwitchOptions(activeUnitKey) {
    unitDetailSwitchOptions.forEach(option => {
      const isCurrent = option.dataset.unitDetailSwitch === activeUnitKey;
      option.classList.toggle('is-current', isCurrent);
      option.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });
  }

  function activateUnit(unitKey) {
    currentUnitKey = unitKey;

    unitPickerLinks.forEach(link => {
      const isActive = link.dataset.unitLink === unitKey;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    unitCards.forEach(card => {
      card.classList.toggle('is-selected', card.dataset.unitCard === unitKey);
    });

    syncUnitDetailSwitchOptions(unitKey);
    renderUnitDetail(unitKey);
  }

  unitPickerLinks.forEach(link => {
    const cityLabel = link.querySelector('.unit-picker-city');
    const unitKey = link.dataset.unitLink;
    if (cityLabel && unitKey && unitPickerLabels[unitKey]) {
      cityLabel.textContent = unitPickerLabels[unitKey];
    }
  });

  unitPickerLinks.forEach(link => {
    link.addEventListener('click', e => {
      const unitKey = link.dataset.unitLink;
      if (!unitKey) return;

      e.preventDefault();
      hasUserChosenUnit = true;
      activateUnit(unitKey);

      const target = unitDetailSection || document.querySelector(link.getAttribute('href'));
      if (target) {
        smoothScrollToTarget(target, 0);
      }
    });
  });

  if (unitDetailSwitch && unitDetailSwitchMenu) {
    unitDetailSwitch.addEventListener('click', e => {
      e.preventDefault();

      if (unitDetailSwitchMenu.hidden) {
        openUnitDetailSwitchMenu();
      } else {
        closeUnitDetailSwitchMenu();
      }
    });
  }

  unitDetailSwitchOptions.forEach(option => {
    option.addEventListener('click', () => {
      const unitKey = option.dataset.unitDetailSwitch;
      if (!unitKey) return;

      hasUserChosenUnit = true;
      activateUnit(unitKey);
      closeUnitDetailSwitchMenu();

      if (unitDetailSection) {
        smoothScrollToTarget(unitDetailSection, 0);
      }
    });
  });

  if (unitPickerLinks.length) {
    activateUnit('balneario');
  }

  /* ── 6.5 SNAP ENTRE BLOCOS ──────────────────────────────── */
  let generatedUnitPickerDots = [];
  let unitPickerDotsTimer = 0;

  function populateUnitPickerDots() {
    if (!unitPickerAtmosphere) return;

    generatedUnitPickerDots.forEach(dot => dot.remove());
    generatedUnitPickerDots = [];

    const dotColors = [
      '96, 165, 250',
      '56, 189, 248',
      '191, 219, 254',
      '59, 130, 246'
    ];
    const count = window.innerWidth <= 480
      ? 34
      : window.innerWidth <= 768
        ? 52
        : 110;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      const size = Math.random() < 0.14
        ? Math.random() * 3 + 3.6
        : Math.random() * 2 + 1.1;

      dot.className = 'unit-picker-dot unit-picker-dot--generated';
      dot.style.setProperty('--x', `${(Math.random() * 100).toFixed(2)}%`);
      dot.style.setProperty('--y', `${(Math.random() * 100).toFixed(2)}%`);
      dot.style.setProperty('--size', `${size.toFixed(2)}px`);
      dot.style.setProperty('--duration', `${(Math.random() * 4.8 + 4.4).toFixed(2)}s`);
      dot.style.setProperty('--delay', `${(Math.random() * 3.2).toFixed(2)}s`);
      dot.style.setProperty('--opacity', (Math.random() * 0.46 + 0.24).toFixed(2));
      dot.style.setProperty('--dot-rgb', dotColors[Math.floor(Math.random() * dotColors.length)]);
      dot.style.setProperty('--glow', `${(size * (Math.random() * 4.8 + 5.4)).toFixed(1)}px`);
      dot.style.setProperty('--drift-x', `${((Math.random() - 0.5) * 34).toFixed(1)}px`);
      dot.style.setProperty('--drift-y', `${(-(Math.random() * 24 + 10)).toFixed(1)}px`);
      unitPickerAtmosphere.appendChild(dot);
      generatedUnitPickerDots.push(dot);
    }
  }

  populateUnitPickerDots();

  window.addEventListener('resize', () => {
    clearTimeout(unitPickerDotsTimer);
    unitPickerDotsTimer = window.setTimeout(populateUnitPickerDots, 180);
  });

  const heroSection = document.getElementById('inicio');
  const unitPickerSection = document.getElementById('selecao-unidade');
  const unitPickerRevealThresholds = [0.22, 0.46, 0.72];

  let blockTransitionRaf = 0;

  unitPickerLinks.forEach(link => {
    link.classList.add('is-scroll-staged');
  });

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isUnitPickerGateActive() {
    if (hasUserChosenUnit || !unitPickerSection || !unitDetailSection) return false;

    const pickerTop = unitPickerSection.offsetTop;
    const detailTop = unitDetailSection.offsetTop;

    return window.scrollY >= pickerTop - 4 && window.scrollY < detailTop - 4;
  }

  function enforceUnitPickerGate() {
    if (!isUnitPickerGateActive() || !unitPickerSection) return;

    const pickerTop = unitPickerSection.offsetTop;
    if (window.scrollY > pickerTop + 2) {
      window.scrollTo(0, pickerTop);
    }
  }

  function updateBlockTransition() {
    blockTransitionRaf = 0;
    if (!heroSection || !unitPickerSection) return;

    const unitRect = unitPickerSection.getBoundingClientRect();
    const progress = clamp((window.innerHeight - unitRect.top) / (window.innerHeight * 0.92), 0, 1);

    heroSection.style.setProperty('--hero-exit', progress.toFixed(3));
    unitPickerSection.style.setProperty('--unit-entry', progress.toFixed(3));

    unitPickerLinks.forEach((link, index) => {
      const isVisible = progress >= unitPickerRevealThresholds[index];
      link.classList.toggle('is-scroll-visible', isVisible);
    });
  }

  function requestBlockTransitionUpdate() {
    if (blockTransitionRaf) return;
    blockTransitionRaf = requestAnimationFrame(updateBlockTransition);
  }

  window.addEventListener('wheel', e => {
    if (!isUnitPickerGateActive() || e.deltaY <= 0) return;
    e.preventDefault();
    enforceUnitPickerGate();
  }, { passive: false });

  document.addEventListener('click', e => {
    if (!unitDetailSwitcher || !unitDetailSwitch || !unitDetailSwitchMenu) return;
    if (unitDetailSwitchMenu.hidden) return;
    if (unitDetailSwitcher.contains(e.target)) return;
    closeUnitDetailSwitchMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeUnitDetailSwitchMenu();
      if (document.activeElement && unitDetailSwitcher && unitDetailSwitcher.contains(document.activeElement)) {
        unitDetailSwitch.focus();
      }
    }
  });

  window.addEventListener('scroll', enforceUnitPickerGate, { passive: true });
  window.addEventListener('scroll', requestBlockTransitionUpdate, { passive: true });
  window.addEventListener('resize', requestBlockTransitionUpdate);
  updateBlockTransition();

  /* ── 7. SCROLL ANIMATIONS – Intersection Observer ───────── */
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

  /* ── 8. CANVAS PARTÍCULAS – hero background ─────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Cores das partículas (compatíveis com a paleta da marca)
  const COLORS = [
    'rgba(191, 219, 254, {a})',
    'rgba(96, 165, 250, {a})',
    'rgba(56, 189, 248, {a})',
    'rgba(59, 130, 246, {a})',
  ];

  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((W * H) / 2500), 460);
    particles = [];

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = Math.random() < 0.16
        ? Math.random() * 2.4 + 1.7
        : Math.random() * 1.35 + 0.45;
      const baseAlpha = Math.random() * 0.52 + 0.22;
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.22,
        vy:    (Math.random() - 0.5) * 0.22,
        size,
        glow:  size * (Math.random() * 4.2 + 3.8),
        baseAlpha,
        pulse: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.035 + 0.01,
        color,
      });
    }
  }

  function drawParticle(p) {
    const alpha = p.baseAlpha * (0.62 + ((Math.sin(p.pulse) + 1) * 0.32));
    const fill = p.color.replace('{a}', alpha);
    const glow = p.color.replace('{a}', Math.min(alpha + 0.22, 0.95));
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.shadowColor = glow;
    ctx.shadowBlur = p.glow;
    ctx.fill();
    ctx.restore();
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.twinkle;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
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

  /* ── 9. CONTADOR ANIMADO – hero stats ────────────────────── */
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

  /* ── 10. PARALLAX SUAVE – orbs de fundo ─────────────────── */
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
