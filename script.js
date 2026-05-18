/* Paul Martins — Portfolio
 * Vanilla JS: loader, nav, typing, reveal, counters, particles, mobile menu.
 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 300);
  });

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Nav scroll state + active link ----------
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
    const y = window.scrollY + 120;
    let currentId = null;
    for (const s of sections) {
      if (s.offsetTop <= y) currentId = s.id;
    }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Typing effect ----------
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'Distributed systems · Cloud architecture · Go & PHP',
      'Designing APIs that age well.',
      'Modernizing legacy systems at enterprise scale.',
      'Building reliability into the platform.'
    ];
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const phrase = phrases[pi];
      typedEl.textContent = phrase.slice(0, ci);
      if (!deleting) {
        if (ci < phrase.length) { ci++; setTimeout(tick, 38); }
        else { deleting = true; setTimeout(tick, 1800); }
      } else {
        if (ci > 0) { ci--; setTimeout(tick, 18); }
        else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 240); }
      }
    };
    if (!reduceMotion) tick(); else typedEl.textContent = phrases[0];
  }

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('.num[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  // ---------- Particles ----------
  const canvas = document.getElementById('particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const density = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 22000));
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15 * DPR,
        vy: (Math.random() - 0.5) * 0.15 * DPR,
        r: (Math.random() * 1.4 + 0.4) * DPR
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Lines
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const max = 130 * DPR;
          if (d < max) {
            ctx.strokeStyle = 'rgba(124,140,255,' + (0.10 * (1 - d / max)).toFixed(3) + ')';
            ctx.lineWidth = DPR * 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(180,195,255,0.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
  }
})();