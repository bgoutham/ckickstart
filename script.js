/* ============================================
   COLLEGE KICKSTART — INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== NAV SCROLL ====================
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    nav.classList.toggle('nav--scrolled', currentScroll > 20);
    lastScroll = currentScroll;
  });

  // ==================== MOBILE MENU ====================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // ==================== DARK MODE ====================
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    setTheme(prefersDark.matches);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
  });

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });

  // ==================== SCROLL ANIMATIONS ====================
  const animateElements = document.querySelectorAll('.animate-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animations slightly
        const delay = Array.from(animateElements).indexOf(entry.target) % 6;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // ==================== ANIMATED COUNTERS ====================
  const counters = document.querySelectorAll('.stat-card__number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ==================== AUDIENCE TABS ====================
  const audienceTabs = document.querySelectorAll('.audience-tab');
  const audiencePanels = document.querySelectorAll('.audience-panel');

  audienceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update tabs
      audienceTabs.forEach(t => t.classList.remove('audience-tab--active'));
      tab.classList.add('audience-tab--active');

      // Update panels
      audiencePanels.forEach(panel => {
        panel.classList.remove('audience-panel--active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('audience-panel--active');
          // Re-trigger animation for the panel content
          const animEl = panel.querySelector('.animate-in');
          if (animEl) {
            animEl.classList.remove('visible');
            requestAnimationFrame(() => {
              animEl.classList.add('visible');
            });
          }
        }
      });
    });
  });

  // ==================== PRICING TOGGLE ====================
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const priceAmounts = document.querySelectorAll('.pricing-card__amount');
  const pricePeriods = document.querySelectorAll('.pricing-card__period');
  let isAnnual = false;

  pricingToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    pricingToggle.classList.toggle('pricing__toggle-switch--active', isAnnual);
    monthlyLabel.classList.toggle('pricing__toggle-label--active', !isAnnual);
    annualLabel.classList.toggle('pricing__toggle-label--active', isAnnual);

    priceAmounts.forEach(amount => {
      const monthly = amount.dataset.monthly;
      const annual = amount.dataset.annual;
      const targetValue = isAnnual ? annual : monthly;

      // Animate the number change
      amount.style.transform = 'translateY(-10px)';
      amount.style.opacity = '0';

      setTimeout(() => {
        amount.textContent = targetValue;
        amount.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
          amount.style.transform = 'translateY(0)';
          amount.style.opacity = '1';
        });
      }, 150);
    });

    pricePeriods.forEach(period => {
      const monthlyText = period.dataset.monthly;
      const annualText = period.dataset.annual;
      if (monthlyText && annualText) {
        period.textContent = isAnnual ? annualText : monthlyText;
      }
    });
  });

  // ==================== FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('faq-item--open');
        otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('faq-item--open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==================== LOGIN MODAL ====================
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal() {
    loginModal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    loginModal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  loginBtn.addEventListener('click', openModal);
  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  // Login form
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate login
    const btn = loginForm.querySelector('button[type="submit"]');
    btn.textContent = 'Logging in...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Log In';
      btn.disabled = false;
      closeModal();
    }, 1500);
  });

  // ==================== NEWSLETTER FORM ====================
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Subscribed!';
    btn.style.background = 'var(--green-500)';
    input.value = '';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  });

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==================== ACTIVE NAV LINK ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: `-${nav.offsetHeight}px 0px -50% 0px`
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ==================== DASHBOARD BAR ANIMATION ====================
  const dashboardBars = document.querySelectorAll('.dashboard__bar-fill');
  const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.dashboard__bar-fill');
        bars.forEach((bar, i) => {
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
          }, 300 + (i * 200));
        });
        dashboardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const dashboard = document.querySelector('.dashboard__school-list');
  if (dashboard) {
    dashboardObserver.observe(dashboard);
  }

  // ==================== TILT EFFECT ON DASHBOARD ====================
  const heroVisual = document.querySelector('.hero__dashboard');

  if (heroVisual && window.innerWidth > 1024) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const dashboard = heroVisual.querySelector('.dashboard');
      dashboard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      const dashboard = heroVisual.querySelector('.dashboard');
      dashboard.style.transform = 'rotateY(-5deg) rotateX(2deg)';
    });
  }

  // ==================== HERO ANIMATIONS ON LOAD ====================
  const heroAnimElements = document.querySelectorAll('.hero .animate-in');
  heroAnimElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + (i * 150));
  });
});
