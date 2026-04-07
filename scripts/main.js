/* ============================================================
   S.E.E — Unified Site JavaScript
   Handles: component loading, navigation, animations, utilities
   ============================================================ */

(function () {
    'use strict';

    // ── Component Loader ─────────────────────────────────────
    async function loadComponent(url, targetId) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load ${url}`);
            const html = await res.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
            }
            return html;
        } catch (err) {
            console.warn(`Component load failed: ${url}`, err);
            return null;
        }
    }

    async function initComponents() {
        // Load header
        const headerSlot = document.getElementById('header-slot');
        if (headerSlot) {
            await loadComponent('/components/header.html', 'header-slot');
            initNavigation();
            highlightActiveNav();
            initHeaderScroll();
        }

        // Load footer
        const footerSlot = document.getElementById('footer-slot');
        if (footerSlot) {
            await loadComponent('/components/footer.html', 'footer-slot');
            initBackToTop();
        }
    }

    // ── Navigation ───────────────────────────────────────────
    function initNavigation() {
        const toggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('main-nav');
        const overlay = document.getElementById('nav-overlay');

        if (!toggle || !nav) return;

        function openNav() {
            toggle.classList.add('active');
            nav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.contains('active');
            isOpen ? closeNav() : openNav();
        });

        if (overlay) {
            overlay.addEventListener('click', closeNav);
        }

        // Close nav on link click (mobile)
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeNav();
            }
        });

        // Close on resize above mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // ── Active Nav Highlight ─────────────────────────────────
    function highlightActiveNav() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            const page = link.getAttribute('data-page');
            if (!page) return;

            const isHome = page === 'index';
            const isActive = isHome
                ? (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/'))
                : currentPath.includes(page);

            if (isActive) {
                link.classList.add('active');
            }
        });
    }

    // ── Header Scroll Effect ─────────────────────────────────
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ── Back to Top ──────────────────────────────────────────
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Scroll Animations ────────────────────────────────────
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        });

        elements.forEach(el => observer.observe(el));
    }

    // ── Smooth Scroll for Anchor Links ───────────────────────
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ── FAQ Accordion ────────────────────────────────────────
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = question.getAttribute('aria-expanded') === 'true';

                // Close all others
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    const a = q.nextElementSibling;
                    if (a) a.classList.remove('show');
                });

                // Toggle current
                if (!isOpen) {
                    question.setAttribute('aria-expanded', 'true');
                    if (answer) answer.classList.add('show');
                }
            });
        });
    }

    // ── Search Filter (Funding page) ─────────────────────────
    function initSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const items = document.querySelectorAll('.resource-item');

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // ── Tab Filter ───────────────────────────────────────────
    function initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter groups
                const groups = document.querySelectorAll('.resource-group');
                groups.forEach(group => {
                    if (target === 'all') {
                        group.style.display = '';
                    } else {
                        group.style.display = group.id === target ? '' : 'none';
                    }
                });
            });
        });
    }

    // ── Contact Form ─────────────────────────────────────────
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Success feedback (no backend)
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }

    // ── Copy to Clipboard ────────────────────────────────────
    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-copy');
                const el = document.querySelector(target);
                if (!el) return;

                navigator.clipboard.writeText(el.textContent.trim()).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = originalText; }, 2000);
                }).catch(() => {
                    // Fallback
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = originalText; }, 2000);
                });
            });
        });
    }

    // ── Initialize Everything ─────────────────────────────────
    async function init() {
        await initComponents();
        initScrollAnimations();
        initSmoothScroll();
        initFAQ();
        initSearch();
        initTabs();
        initContactForm();
        initCopyButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();