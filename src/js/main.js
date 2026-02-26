/**
 * main.js — Portfolio interactions
 *
 * Responsibilities:
 *  1. Hero canvas — animated particle mesh
 *  2. Typing effect on hero subtitle
 *  3. Scroll-triggered reveal animations (IntersectionObserver)
 *  4. Nav: scroll-aware class toggle + active link highlighting
 *  5. Mobile hamburger menu
 *  6. Footer copyright year
 *  7. Contact form validation + UX feedback
 */

'use strict';

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/**
 * Throttle a callback so it runs at most once per `limit` ms.
 * @param {Function} fn
 * @param {number} limit
 */
function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}

/* ─── 1. Hero Canvas (Particle Mesh) ─────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, animId;

  /* Color values matching CSS --clr-accent and --clr-cyan */
  const ACCENT   = { r: 124, g: 109, b: 250 };
  const CYAN     = { r:  34, g: 211, b: 238 };
  const PARTICLE_COUNT = Math.min(70, Math.floor(window.innerWidth / 16));
  const CONNECT_DIST   = 160;  /* px — max distance to draw a line between particles */

  function lerp(a, b, t) { return a + (b - a) * t; }

  function interpolateColor(t) {
    /* t in [0,1]: blend ACCENT → CYAN */
    return {
      r: Math.round(lerp(ACCENT.r, CYAN.r, t)),
      g: Math.round(lerp(ACCENT.g, CYAN.g, t)),
      b: Math.round(lerp(ACCENT.b, CYAN.b, t)),
    };
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * width;
      this.y  = initial ? Math.random() * height : Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.8;
      /* Color lerp factor */
      this.t  = Math.random();
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;
      /* Wrap around edges */
      if (this.x < -10)       this.x = width  + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10)       this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      const c = interpolateColor(this.t);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.65)`;
      ctx.fill();
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width  = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const alpha  = (1 - dist / CONNECT_DIST) * 0.18;
          const tAvg   = (particles[i].t + particles[j].t) / 2;
          const c      = interpolateColor(tAvg);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.move(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(frame);
  }

  /* Pause animation when tab is not visible (saves CPU) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(frame);
    }
  });

  window.addEventListener('resize', throttle(() => {
    resize();
    buildParticles();
  }, 200));

  resize();
  buildParticles();
  frame();
})();


/* ─── 2. Typing Effect ────────────────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  /* TODO: Customise these words to match your specialties */
  const words = ['web', 'cloud', 'the future'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  const PAUSE_BETWEEN = 1800; /* ms to hold before deleting */
  const TYPE_SPEED    = 90;   /* ms per character typed     */
  const DELETE_SPEED  = 55;   /* ms per character deleted   */

  function tick() {
    const current = words[wordIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting  = false;
        wordIdx   = (wordIdx + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        if (!paused) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_BETWEEN);
        }
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  /* Slight delay before typing starts */
  setTimeout(tick, 1400);
})();


/* ─── 3. Scroll Reveal (IntersectionObserver) ────────────────────────────── */
(function initReveal() {
  /* Bail out if browser doesn't support IO (very old) */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Stop observing once revealed to reduce overhead */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   /* Trigger when 12% of element is visible */
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Hero elements have inline transitions, trigger them immediately */
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);
})();


/* ─── 4. Navigation: Scroll State + Active Section ───────────────────────── */
(function initNav() {
  const nav     = document.getElementById('nav');
  const links   = document.querySelectorAll('.nav__link[href^="#"]');
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if (!nav) return;

  /* Add/remove .scrolled class based on scroll position */
  function updateNavStyle() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }

  /* Highlight the nav link whose section is currently in view */
  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;

    let current = sections[0];
    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) current = section;
    });

    links.forEach(link => {
      const target = link.getAttribute('href').slice(1); /* strip '#' */
      link.classList.toggle('active', target === current?.id);
    });
  }

  const onScroll = throttle(() => {
    updateNavStyle();
    updateActiveLink();
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNavStyle();
  updateActiveLink();
})();


/* ─── 5. Mobile Hamburger ─────────────────────────────────────────────────── */
(function initHamburger() {
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('nav-links');
  if (!toggle || !menu) return;

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open', !expanded);
    /* Prevent body scroll when menu is open */
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  /* Close on any nav link click */
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  /* Close when clicking outside */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      close();
    }
  });
})();


/* ─── 6. Footer Year ─────────────────────────────────────────────────────── */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─── 7. Contact Form ────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  /*
   * This is a static mailto form.
   * For a real backend, swap the action URL to a Formspree/Netlify/SES endpoint
   * and send a JSON POST via fetch() instead.
   */
  form.addEventListener('submit', e => {
    const name    = form.querySelector('#contact-name')?.value.trim();
    const email   = form.querySelector('#contact-email')?.value.trim();
    const message = form.querySelector('#contact-message')?.value.trim();

    /* Basic client-side validation */
    if (!name || !email || !message) {
      e.preventDefault();
      showFormError(form, 'Please fill in all fields.');
      return;
    }

    /* Simple email pattern check */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      showFormError(form, 'Please enter a valid email address.');
      return;
    }

    /* Let the mailto action proceed (opens mail client) */
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.textContent = 'Opening mail client…';
      btn.disabled = true;
      /* Re-enable after a short delay */
      setTimeout(() => {
        btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>';
        btn.disabled = false;
      }, 3000);
    }
  });

  function showFormError(form, message) {
    /* Remove any existing error */
    form.querySelector('.form__error')?.remove();
    const err = document.createElement('p');
    err.className = 'form__note form__error';
    err.style.color = 'var(--clr-error)';
    err.textContent = message;
    form.prepend(err);
    /* Auto-remove after 4s */
    setTimeout(() => err.remove(), 4000);
  }
})();
