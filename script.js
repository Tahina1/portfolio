/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

// Mark document as JS-capable so CSS reveal animations activate safely
document.documentElement.classList.add('js');

/* ── 1. Typing animation ──────────────────────────────────── */
(function initTyping() {
    const target = document.getElementById('typingTarget');
    if (!target) return;

    const phrases = [
        'scalable applications.',
        'C# / .NET solutions.',
        'Node.js back-ends.',
        'REST APIs.',
        'elegant software.',
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    const WRITE_SPEED  = 60;
    const DELETE_SPEED = 35;
    const PAUSE_END    = 1800;
    const PAUSE_START  = 350;

    function tick() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            charIndex--;
            target.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                isDeleting  = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, PAUSE_START);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        } else {
            charIndex++;
            target.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(tick, PAUSE_END);
                return;
            }
            setTimeout(tick, WRITE_SPEED);
        }
    }

    setTimeout(tick, 800);
})();


/* ── 2. Particle canvas ───────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles, mouse = { x: null, y: null };
    const COUNT = 70;
    const MAX_DIST = 130;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
        return {
            x:  randomBetween(0, W),
            y:  randomBetween(0, H),
            vx: randomBetween(-0.25, 0.25),
            vy: randomBetween(-0.25, 0.25),
            r:  randomBetween(1, 2.5),
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Update + draw dots
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(167, 139, 250, 0.55)';
            ctx.fill();
        }

        // Lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const opacity = (1 - dist / MAX_DIST) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Mouse interaction lines
        if (mouse.x !== null) {
            for (const p of particles) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST * 1.4) {
                    const opacity = (1 - dist / (MAX_DIST * 1.4)) * 0.45;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { init(); });
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    init();
    draw();
})();


/* ── 3. Navbar scroll effect ──────────────────────────────── */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ── 4. Active nav link on scroll ────────────────────────── */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach((s) => io.observe(s));
})();


/* ── 5. Scroll reveal ─────────────────────────────────────── */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // stagger siblings in same parent
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
                const delay    = Math.max(0, siblings.indexOf(entry.target)) * 80;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el) => io.observe(el));
})();


/* ── 6. Mobile hamburger menu ─────────────────────────────── */
(function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mob-link').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
    });
})();


/* ── 7. Projects section toggle ───────────────────────────── */
(function initProjectsToggle() {
    const btn     = document.getElementById('toggleProjects');
    const content = document.getElementById('projectsContent');
    const icon    = document.getElementById('toggleIcon');
    const label   = document.getElementById('toggleLabel');
    if (!btn || !content) return;

    let visible = true;

    btn.addEventListener('click', () => {
        visible = !visible;
        if (visible) {
            content.style.display = '';
            icon.className  = 'fas fa-eye-slash';
            label.textContent = 'Hide section';
        } else {
            content.style.display = 'none';
            icon.className  = 'fas fa-eye';
            label.textContent = 'Show section';
        }
    });
})();


/* ── 8. Contact form ──────────────────────────────────────── */
(function initContactForm() {
    const form   = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled    = true;
        btn.textContent = 'Sending…';

        /* ── Replace this block with your actual backend / Formspree / EmailJS call ──
           Example with Formspree:
           const res = await fetch('https://formspree.io/f/YOUR_ID', {
               method: 'POST',
               headers: { 'Accept': 'application/json' },
               body: new FormData(form),
           });
           if (res.ok) { ... } else { ... }
        ── ─────────────────────────────────────────────────────────────────────────── */

        // Simulated success for demo purposes
        await new Promise((r) => setTimeout(r, 1200));

        form.reset();
        status.textContent = "✓ Message sent! I'll get back to you soon.";
        status.className   = 'form-status success';
        btn.disabled       = false;
        btn.innerHTML      = 'Send Message <i class="fas fa-paper-plane"></i>';

        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 6000);
    });
})();


/* ── 9. Smooth scroll for anchor links ────────────────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();
