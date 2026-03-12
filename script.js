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

  // ==================== POPULAR SCHOOLS TEASER ====================
  const stateFilter = document.getElementById('stateFilter');
  const schoolTypeFilter = document.getElementById('schoolTypeFilter');
  const popularSchoolsSection = document.getElementById('popular-schools');

  if (popularSchoolsSection && stateFilter && schoolTypeFilter) {
    // Mock data sets keyed by state + type
    const mockSchoolData = {
      national: {
        all: [
          { name: 'UC Berkeley', count: '128,192', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'UCLA', count: '119,847', pct: 88, color: '#C1472B, #E8683A' },
          { name: 'NYU', count: '105,324', pct: 78, color: '#3b82f6, #2563eb' },
          { name: 'Northeastern', count: '96,340', pct: 71, color: '#3b82f6, #2563eb' },
          { name: 'Boston University', count: '80,798', pct: 60, color: '#8b5cf6, #7c3aed' },
        ],
        private: [
          { name: 'Stanford', count: '54,120', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'Harvard', count: '51,832', pct: 90, color: '#C1472B, #E8683A' },
          { name: 'Yale', count: '47,610', pct: 82, color: '#3b82f6, #2563eb' },
          { name: 'Princeton', count: '39,644', pct: 68, color: '#3b82f6, #2563eb' },
          { name: 'Duke', count: '37,302', pct: 64, color: '#8b5cf6, #7c3aed' },
        ],
        public: [
          { name: 'UC Berkeley', count: '128,192', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'UCLA', count: '119,847', pct: 88, color: '#C1472B, #E8683A' },
          { name: 'UT Austin', count: '72,611', pct: 53, color: '#3b82f6, #2563eb' },
          { name: 'U of Michigan', count: '79,145', pct: 58, color: '#3b82f6, #2563eb' },
          { name: 'Georgia Tech', count: '68,493', pct: 50, color: '#8b5cf6, #7c3aed' },
        ],
        charter: [
          { name: 'KIPP network schools', count: '12,340', pct: 95, color: '#22c55e, #16a34a' },
          { name: 'Success Academy alums', count: '9,871', pct: 75, color: '#22c55e, #16a34a' },
          { name: 'Uncommon Schools', count: '8,102', pct: 62, color: '#3b82f6, #2563eb' },
          { name: 'BASIS Schools', count: '6,554', pct: 50, color: '#3b82f6, #2563eb' },
          { name: 'Noble Network', count: '5,201', pct: 40, color: '#8b5cf6, #7c3aed' },
        ],
      },
      ca: {
        all: [
          { name: 'UCLA', count: '83,014', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'UC Berkeley', count: '78,562', pct: 90, color: '#C1472B, #E8683A' },
          { name: 'UC San Diego', count: '64,108', pct: 73, color: '#3b82f6, #2563eb' },
          { name: 'USC', count: '59,421', pct: 68, color: '#3b82f6, #2563eb' },
          { name: 'Stanford', count: '54,120', pct: 62, color: '#8b5cf6, #7c3aed' },
        ],
      },
      ny: {
        all: [
          { name: 'NYU', count: '105,324', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'Columbia', count: '60,377', pct: 57, color: '#C1472B, #E8683A' },
          { name: 'Cornell', count: '58,461', pct: 55, color: '#3b82f6, #2563eb' },
          { name: 'SUNY Binghamton', count: '44,319', pct: 42, color: '#3b82f6, #2563eb' },
          { name: 'Fordham', count: '38,021', pct: 36, color: '#8b5cf6, #7c3aed' },
        ],
      },
      tx: {
        all: [
          { name: 'UT Austin', count: '72,611', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'Texas A&M', count: '63,850', pct: 84, color: '#C1472B, #E8683A' },
          { name: 'Rice', count: '31,424', pct: 41, color: '#3b82f6, #2563eb' },
          { name: 'SMU', count: '28,773', pct: 38, color: '#3b82f6, #2563eb' },
          { name: 'UT Dallas', count: '25,014', pct: 33, color: '#8b5cf6, #7c3aed' },
        ],
      },
      ma: {
        all: [
          { name: 'Northeastern', count: '96,340', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'Boston University', count: '80,798', pct: 84, color: '#C1472B, #E8683A' },
          { name: 'Harvard', count: '51,832', pct: 54, color: '#3b82f6, #2563eb' },
          { name: 'MIT', count: '40,792', pct: 42, color: '#3b82f6, #2563eb' },
          { name: 'Boston College', count: '37,890', pct: 39, color: '#8b5cf6, #7c3aed' },
        ],
      },
      fl: {
        all: [
          { name: 'UF', count: '68,210', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'FSU', count: '55,322', pct: 81, color: '#C1472B, #E8683A' },
          { name: 'UCF', count: '50,103', pct: 73, color: '#3b82f6, #2563eb' },
          { name: 'U of Miami', count: '43,817', pct: 64, color: '#3b82f6, #2563eb' },
          { name: 'USF', count: '38,652', pct: 57, color: '#8b5cf6, #7c3aed' },
        ],
      },
      il: {
        all: [
          { name: 'UIUC', count: '60,798', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'Northwestern', count: '47,402', pct: 78, color: '#C1472B, #E8683A' },
          { name: 'U of Chicago', count: '38,216', pct: 63, color: '#3b82f6, #2563eb' },
          { name: 'DePaul', count: '29,431', pct: 48, color: '#3b82f6, #2563eb' },
          { name: 'Loyola Chicago', count: '24,118', pct: 40, color: '#8b5cf6, #7c3aed' },
        ],
      },
      pa: {
        all: [
          { name: 'Penn State', count: '74,113', pct: 95, color: '#C1472B, #E8683A' },
          { name: 'UPenn', count: '54,588', pct: 74, color: '#C1472B, #E8683A' },
          { name: 'Drexel', count: '43,007', pct: 58, color: '#3b82f6, #2563eb' },
          { name: 'Carnegie Mellon', count: '37,614', pct: 51, color: '#3b82f6, #2563eb' },
          { name: 'Temple', count: '33,940', pct: 46, color: '#8b5cf6, #7c3aed' },
        ],
      },
    };

    const stateNames = {
      national: 'National', ca: 'California', ny: 'New York', tx: 'Texas',
      ma: 'Massachusetts', fl: 'Florida', il: 'Illinois', pa: 'Pennsylvania'
    };
    const typeNames = {
      all: 'All School Types', private: 'Private Schools',
      public: 'Public Schools', charter: 'Charter Schools'
    };

    function getSchoolData(state, type) {
      const stateData = mockSchoolData[state] || mockSchoolData.national;
      return stateData[type] || stateData.all || mockSchoolData.national.all;
    }

    function updatePopularSchoolsChart() {
      const state = stateFilter.value;
      const type = schoolTypeFilter.value;
      const data = getSchoolData(state, type);
      const stateName = stateNames[state] || 'National';
      const typeName = typeNames[type] || 'All School Types';

      // Update subtitle
      const chartSub = popularSchoolsSection.querySelector('.popular-schools__chart-sub');
      if (chartSub) {
        chartSub.textContent = `${stateName} · ${typeName} · 2024-2026`;
      }

      // Update the visible bar groups (not the blurred ones)
      const visibleBarGroups = popularSchoolsSection.querySelectorAll(
        '.popular-schools__chart > .popular-schools__bar-group'
      );

      visibleBarGroups.forEach((group, i) => {
        if (!data[i]) return;
        const item = data[i];
        const label = group.querySelector('.popular-schools__bar-label');
        const fill = group.querySelector('.popular-schools__bar-fill');

        if (label) {
          label.children[0].textContent = item.name;
          label.children[1].textContent = item.count;
        }
        if (fill) {
          // Animate: collapse then expand
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = item.pct + '%';
            fill.style.background = `linear-gradient(90deg, ${item.color})`;
          }, 100);
        }
      });
    }

    stateFilter.addEventListener('change', updatePopularSchoolsChart);
    schoolTypeFilter.addEventListener('change', updatePopularSchoolsChart);

    // Animate bars on scroll into view
    const popularSchoolsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.popular-schools__chart > .popular-schools__bar-group .popular-schools__bar-fill');
          fills.forEach((fill, i) => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, 200 + (i * 150));
          });
          popularSchoolsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const chartEl = popularSchoolsSection.querySelector('.popular-schools__chart');
    if (chartEl) {
      popularSchoolsObserver.observe(chartEl);
    }

    // Unlock button scrolls to pricing
    const gate = popularSchoolsSection.querySelector('.popular-schools__gate');
    if (gate) {
      const unlockBtn = gate.querySelector('.btn');
      if (unlockBtn) {
        unlockBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const pricingSection = document.getElementById('pricing');
          if (pricingSection) {
            const offset = nav.offsetHeight + 16;
            const targetPosition = pricingSection.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        });
      }
    }
  }

  // ==================== CK 360 ANIMATIONS ====================
  const ck360Section = document.getElementById('ck360');

  if (ck360Section) {
    // SVG line draw-in animation
    const ck360LineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = entry.target.querySelectorAll('.ck360-line-chart__line');
          lines.forEach((line, i) => {
            const length = line.getTotalLength();
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            line.style.transition = 'none';
            // Force reflow
            line.getBoundingClientRect();
            line.style.transition = `stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.2}s`;
            line.style.strokeDashoffset = '0';
          });

          // Also fade in area fills
          const areas = entry.target.querySelectorAll('.ck360-line-chart__area');
          areas.forEach((area, i) => {
            area.style.opacity = '0';
            area.style.transition = `opacity 1s ease ${0.8 + i * 0.2}s`;
            area.getBoundingClientRect();
            area.style.opacity = '0.1';
          });

          ck360LineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const lineChart = ck360Section.querySelector('.ck360-line-chart');
    if (lineChart) {
      ck360LineObserver.observe(lineChart);
    }

    // CK 360 bar comparison animation
    const ck360BarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.ck360-bar-compare__fill');
          fills.forEach((fill, i) => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            fill.style.transition = `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`;
            fill.getBoundingClientRect();
            fill.style.width = targetWidth;
          });
          ck360BarObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const barCompare = ck360Section.querySelector('.ck360-bar-compare');
    if (barCompare) {
      ck360BarObserver.observe(barCompare);
    }

    // Heatmap cells fade in with stagger
    const heatmapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cells = entry.target.querySelectorAll('.ck360-heatmap__cell');
          cells.forEach((cell, i) => {
            const originalBg = cell.style.background;
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.7)';
            cell.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
            cell.getBoundingClientRect();
            cell.style.opacity = '1';
            cell.style.transform = 'scale(1)';
          });
          heatmapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const heatmapGrid = ck360Section.querySelector('.ck360-heatmap__grid');
    if (heatmapGrid) {
      heatmapObserver.observe(heatmapGrid);
    }
  }

  // ==================== SOLUTIONS CARDS ANIMATION ====================
  const solutionCards = document.querySelectorAll('.solution-card.animate-in');
  solutionCards.forEach(card => observer.observe(card));
});
