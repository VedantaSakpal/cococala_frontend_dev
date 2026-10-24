/**
 * Coca-Cola Interactive Website Logic
 * - Flavor Picker & Animated Taste Profile Meters
 * - Dark / Light Theme Toggle with LocalStorage Sync
 * - Newsletter Subscription Handler
 * - Intersection Observer Scroll Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Newsletter Form Handler
  const joinForm = document.getElementById('jf');
  const joinMsg = document.getElementById('jm');

  if (joinForm && joinMsg) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('em').value;
      if (email) {
        joinMsg.textContent = '🎉 Thanks for joining! Look out for real magic in your inbox.';
        joinMsg.style.color = '#00a84e';
        joinForm.reset();
        setTimeout(() => {
          joinMsg.textContent = '';
        }, 5000);
      }
    });
  }

  // 2. Flavor Showcase & Meter Gauges
  const flavorsSection = document.getElementById('flavors');
  if (flavorsSection) {
    const flavorData = [
      {
        name: 'Original Taste',
        desc: 'The taste that started it all. Crisp, fizzy, and unmistakably Coca-Cola.',
        bg: '#d6000f',
        canColor: '#d5000f',
        label: 'Coca-Cola',
        meters: [95, 75, 65]
      },
      {
        name: 'Zero Sugar',
        desc: 'The iconic taste you love, with zero sugar. Ice-cold, bold, and bright.',
        bg: '#17171a',
        canColor: '#141414',
        label: 'Zero Sugar',
        meters: [95, 55, 80]
      },
      {
        name: 'Cherry',
        desc: 'A smooth cherry twist on the original. Sweet, fizzy, and full of character.',
        bg: '#8a0d25',
        canColor: '#7d0a1f',
        label: 'Cherry',
        meters: [85, 85, 70]
      }
    ];

    const tabButtons = flavorsSection.querySelectorAll('.tabs-group button');
    const meterBars = flavorsSection.querySelectorAll('.meter-group i');
    const fn = document.getElementById('fn');
    const fd = document.getElementById('fd');
    const cl = document.getElementById('cl');

    function selectFlavor(index) {
      const f = flavorData[index];
      flavorsSection.style.setProperty('--fb', f.bg);
      flavorsSection.style.setProperty('--cb', f.canColor);
      if (fn) fn.textContent = f.name;
      if (fd) fd.textContent = f.desc;
      if (cl) cl.textContent = f.label;

      meterBars.forEach((bar, k) => {
        bar.style.width = f.meters[k] + '%';
      });

      tabButtons.forEach((btn, k) => {
        btn.setAttribute('aria-pressed', k === index ? 'true' : 'false');
      });
    }

    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => selectFlavor(index));
    });

    // Auto-trigger when in viewport
    const flavorObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          selectFlavor(0);
          flavorObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    flavorObserver.observe(flavorsSection);
  }

  // 3. Scroll Reveal Animations
  const root = document.documentElement;
  root.classList.add('js');

  const revealElements = document.querySelectorAll(
    '.moments, .features-grid > div, .flv, .brand-card, .orig, .join'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('rv');
    el.style.transitionDelay = (index % 3) * 0.1 + 's';
  });

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          scrollObserver.unobserve(entry.target);
          setTimeout(() => {
            entry.target.classList.remove('rv', 'in');
            entry.target.style.transitionDelay = '';
          }, 1200);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => scrollObserver.observe(el));

  // 4. Dark & Light Theme Toggle
  const themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = currentTheme;
      try {
        localStorage.setItem('theme', currentTheme);
      } catch (err) {}
    });
  }
});
