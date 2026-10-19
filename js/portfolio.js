/**
 * MOHAMED ABD EL AZIZ — PORTFOLIO JAVASCRIPT
 * Interactive Canvas, Typing Effect, 3D Tilt, Modern Modals & Event Listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Neural Background Canvas
  initNeuralCanvas();

  // 2. Initialize Dynamic Typing Effect
  initTypingEffect();

  // 3. Initialize Skill Filters
  initSkillFilters();

  // 3B. Initialize Project Filters
  initProjectFilters();

  // 4. Initialize Project Cards 3D Tilt
  initCardTilt();

  // 5. Initialize Modals
  initModals();

  // 6. Initialize Navigation & Scroll Spy
  initNavigation();

  // 7. Initialize Contact Form & Copy Email
  initContactActions();

  // 8. Initialize Counters animation
  initStatsCounters();

  // 9. Initialize Theme Toggle (Light & Dark Mode)
  initTheme();

  // 10. Initialize Services & Pricing Tiers
  initPricing();
});

/* ===================================================================
   1. NEURAL NETWORK CANVAS ANIMATION
   =================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 160
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 242, 254,' : 'rgba(121, 40, 202,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.7)' : this.baseColor + ' 0.8)';
      ctx.shadowBlur = isLight ? 4 : 10;
      ctx.shadowColor = isLight ? '#0284c7' : '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * (isLight ? 0.35 : 0.25);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${opacity})` : `rgba(79, 172, 254, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mOpacity = (1 - mdist / mouse.radius) * (isLight ? 0.55 : 0.45);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${mOpacity})` : `rgba(0, 242, 254, ${mOpacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. TYPING EFFECT
   =================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    'AI & Deep Learning Engineer',
    'CS Student @ Faculty of Science, AlexU',
    'Neural Networks & NLP with TensorFlow & Keras',
    'Building Optimizers & Algorithms from Scratch',
    'Enterprise Software & Compilers Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentText = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      target.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2000; // Pause at full text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   3. SKILL FILTER TABS
   =================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (category && category.split(' ').includes(filter))) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   3B. PROJECT FILTER TABS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (category && category.split(' ').includes(filter))) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   4. 3D CARD TILT EFFECT
   =================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ===================================================================
   5. NATIVE DIALOG MODAL CONTROLLERS
   =================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal && typeof modal.close === 'function') {
        modal.close();
        document.body.style.overflow = '';
      }
    });
  });

  // Close when clicking outside on ::backdrop
  document.querySelectorAll('dialog.custom-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
        document.body.style.overflow = '';
      }
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });
}

/* ===================================================================
   6. NAVIGATION & SCROLL SPY
   =================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar Scrolled State
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top smooth scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile navigation drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }
}

/* ===================================================================
   7. CONTACT ACTIONS & TOAST
   =================================================================== */
function initContactActions() {
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactForm = document.getElementById('contactForm');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'Sci.MohamedAbdelaziz@alexu.edu.eg';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Direct: ' + email);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value.trim();
      const email = document.getElementById('senderEmail')?.value.trim();
      const subject = document.getElementById('msgSubject')?.value.trim() || 'Portfolio Collaboration Inquiry';
      const message = document.getElementById('msgBody')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Compose mailto URI
      const mailtoUrl = `mailto:Sci.MohamedAbdelaziz@alexu.edu.eg?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      
      showToast('Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-cyan)"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ===================================================================
   8. NUMERICAL STATS COUNTER ANIMATION
   =================================================================== */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let count = 0;
        const duration = 1600;
        const stepTime = 25;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? count.toFixed(2) + suffix : Math.floor(count) + suffix;
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

/* ===================================================================
   9. THEME TOGGLE (LIGHT & DARK MODE)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio_theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  // Determine initial theme (default to dark unless saved or explicitly preferred)
  const currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
  applyTheme(currentTheme, false);

  themeToggleBtn.addEventListener('click', () => {
    const isCurrentLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isCurrentLight ? 'dark' : 'light';
    applyTheme(newTheme, true);
    localStorage.setItem('portfolio_theme', newTheme);
    showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} mode`);
  });

  function applyTheme(theme, animate) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ===================================================================
   10. SERVICES & PRICING TIERS LOGIC
   =================================================================== */
function initPricing() {
  const projectBtn = document.getElementById('pricingProjectBtn');
  const monthlyBtn = document.getElementById('pricingMonthlyBtn');
  const amounts = document.querySelectorAll('.pricing-amount');
  const periods = document.querySelectorAll('.pricing-period');
  const subtexts = document.querySelectorAll('.pricing-subtext');
  const tierButtons = document.querySelectorAll('[data-tier-select]');

  let currentBilling = 'Project-Based';

  if (projectBtn && monthlyBtn) {
    projectBtn.addEventListener('click', () => {
      if (projectBtn.classList.contains('active')) return;
      projectBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
      currentBilling = 'Project-Based';
      updatePrices('project');
    });

    monthlyBtn.addEventListener('click', () => {
      if (monthlyBtn.classList.contains('active')) return;
      monthlyBtn.classList.add('active');
      projectBtn.classList.remove('active');
      currentBilling = 'Monthly Retainer';
      updatePrices('monthly');
    });
  }

  function updatePrices(type) {
    amounts.forEach(el => {
      el.classList.add('changing');
      setTimeout(() => {
        const val = el.getAttribute(`data-${type}`);
        if (val) el.textContent = val;
        el.classList.remove('changing');
      }, 150);
    });

    periods.forEach(el => {
      el.textContent = type === 'project' ? '/ fixed project' : '/ month retainer';
    });

    subtexts.forEach(el => {
      const sub = el.getAttribute(`data-${type}-sub`);
      if (sub) el.textContent = sub;
    });
  }

  // Pre-fill contact form on clicking any tier CTA
  tierButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tierName = btn.getAttribute('data-tier-select');
      if (!tierName) return;

      const subjectInput = document.getElementById('msgSubject');
      const bodyInput = document.getElementById('msgBody');
      const nameInput = document.getElementById('senderName');

      if (subjectInput) {
        subjectInput.value = `Inquiry: ${tierName} (${currentBilling})`;
      }

      if (bodyInput) {
        bodyInput.value = `Hi Mohamed,\n\nI am interested in your "${tierName}" tier (${currentBilling}). Here is an overview of our project requirements:\n\n- Project Objective & Goals: \n- Dataset / System Context: \n- Target Timeline / Deadline: \n\nLooking forward to your response!`;
      }

      showToast(`Selected: ${tierName}`);

      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
        }, 550);
      }
    });
  });
}


