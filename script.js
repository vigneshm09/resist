/* ============================================
   RESIST FITNESS STUDIO — JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 800);
    });

    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 3000);


    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    let ticking = false;
    const onScroll = () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveLink();
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    updateActiveLink();


    // --- Hero Particles ---
    const particlesContainer = document.getElementById('hero-particles');

    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = (60 + Math.random() * 40) + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (1 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    if (!prefersReducedMotion) {
        createParticles();
    }


    // --- Location Map (Google) ---
    function addressToQuery(addressEl) {
        if (!addressEl) return '';
        const parts = addressEl.innerText
            .split('\n')
            .map(s => s.trim().replace(/,+$/, ''))
            .filter(Boolean);
        return parts.join(', ');
    }

    function setupLocationMap() {
        const nameEl = document.getElementById('branch-1-name');
        const addressEl = document.getElementById('branch-1-address');
        const directionsEl = document.getElementById('branch-1-directions');
        const mapIframe = document.querySelector('#branch-1-map iframe');

        const branchLabelInput = document.getElementById('form-branch-label');
        if (branchLabelInput && nameEl && nameEl.textContent) {
            branchLabelInput.value = nameEl.textContent.trim();
        }

        const name = nameEl && nameEl.textContent ? nameEl.textContent.trim() : '';
        const address = addressToQuery(addressEl);

        const autoMap = mapIframe && mapIframe.dataset && mapIframe.dataset.mapAuto === 'true';
        const mapQueryOverride = mapIframe && mapIframe.dataset && mapIframe.dataset.mapQuery ? mapIframe.dataset.mapQuery.trim() : '';
        const mapQuery = (mapQueryOverride || name).trim();

        // Directions: use gym name + address for better accuracy.
        const directionsQuery = [mapQuery || name, address].filter(Boolean).join(', ').trim();

        if (directionsEl) {
            const encoded = encodeURIComponent(directionsQuery || mapQuery);
            directionsEl.href = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
        }

        // Map: show ONLY the gym name (mapQuery) to avoid showing the full address in the embed search.
        if (mapIframe && autoMap) {
            const encoded = encodeURIComponent(mapQuery || directionsQuery);
            mapIframe.src = `https://maps.google.com/maps?q=${encoded}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
        }
    }

    setupLocationMap();


    // --- Counter Animation ---
    const counters = document.querySelectorAll('.hero-stat-number[data-count]');

    function animateCounters() {
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // Start counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, prefersReducedMotion ? 0 : 1600);
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);


    // --- Scroll Reveal ---
    function addRevealClasses() {
        // Section headers
        document.querySelectorAll('.section-header, .section-tag, .section-title').forEach(el => {
            if (!el.closest('.hero')) {
                el.classList.add('reveal');
            }
        });

        // Cards & items with stagger
        const staggerGroups = [
            '.program-card',
            '.facility-item',
            '.branch-card',
            '.testimonial-card',
            '.about-feature',
            '.contact-item'
        ];

        staggerGroups.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                const delay = Math.min(i, 5);
                el.classList.add(`reveal-delay-${delay}`);
            });
        });

        // Other elements
        document.querySelectorAll('.about-image-wrapper, .about-text, .contact-form, .cta-content').forEach(el => {
            el.classList.add('reveal');
        });
    }

    addRevealClasses();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });


    // --- Testimonials Slider ---
    const track = document.getElementById('testimonials-track');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentSlide = 0;
    let slidesPerView = 3;

    function getSlidePerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxSlide() {
        return Math.max(0, cards.length - slidesPerView);
    }

    function updateSlider() {
        if (!track) return;
        slidesPerView = getSlidePerView();
        const cardWidth = cards[0].offsetWidth + 24; // gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        updateDots();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxSlide = getMaxSlide();
        for (let i = 0; i <= maxSlide; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(getMaxSlide(), currentSlide + 1);
            updateSlider();
        });
    }

    createDots();
    updateSlider();

    window.addEventListener('resize', () => {
        currentSlide = Math.min(currentSlide, getMaxSlide());
        createDots();
        updateSlider();
    });

    // Auto-slide
    let autoSlide = null;

    function startAutoSlide() {
        if (prefersReducedMotion) return;
        clearInterval(autoSlide);
        autoSlide = setInterval(() => {
            if (currentSlide >= getMaxSlide()) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        }, 5000);
    }

    startAutoSlide();

    // Pause on hover
    const sliderEl = document.getElementById('testimonials-slider');
    if (sliderEl) {
        sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlide));
        sliderEl.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }


    // --- Contact Form (Google Sheets) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const pageUrlInput = document.getElementById('form-page-url');

    // Paste your Google Apps Script Web App URL here.
    // Example: https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxx/exec
    const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxq1m09wllEVqoWAFREm73mRZMz39PLMht7_VtW3nPdnPeCmt7WglIt5aLXJMx4tkTs/exec';

    function setFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.classList.remove('success', 'error');
        if (type) formStatus.classList.add(type);
    }

    if (pageUrlInput) {
        pageUrlInput.value = window.location.href;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const submitBtn = document.getElementById('form-submit');
            if (!submitBtn) return;

            const endpointLooksUnset =
                !GOOGLE_SHEETS_WEBAPP_URL ||
                GOOGLE_SHEETS_WEBAPP_URL.includes('PASTE_') ||
                !GOOGLE_SHEETS_WEBAPP_URL.startsWith('http');

            if (endpointLooksUnset) {
                setFormStatus('Setup required: add your Google Sheets Web App URL in script.js.', 'error');
                return;
            }

            const originalHTML = submitBtn.innerHTML;
            setFormStatus('Sending your request...', null);

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                formData.set('page_url', window.location.href);
                formData.set('submitted_at', new Date().toISOString());

                const programSelect = document.getElementById('form-program');
                if (programSelect && programSelect.selectedOptions && programSelect.selectedOptions[0]) {
                    const label = programSelect.selectedOptions[0].textContent;
                    if (label) formData.set('program_label', label.trim());
                }

                const branchSelect = document.getElementById('form-branch');
                if (branchSelect && branchSelect.selectedOptions && branchSelect.selectedOptions[0]) {
                    const label = branchSelect.selectedOptions[0].textContent;
                    if (label) formData.set('branch_label', label.trim());
                }

                const body = new URLSearchParams();
                for (const [key, value] of formData.entries()) {
                    body.append(key, String(value));
                }

                const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'omit',
                    redirect: 'follow',
                    body
                });

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const responseText = (await response.text()).trim();
                if (responseText !== 'OK') {
                    throw new Error(`Unexpected response: ${responseText.slice(0, 140) || 'Empty response'}`);
                }

                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Request Sent</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #2E7D32, #1B5E20)';
                submitBtn.style.boxShadow = '0 4px 25px rgba(46, 125, 50, 0.35)';
                setFormStatus('Thanks! Our team will call you back with pricing details.', 'success');

                contactForm.reset();
                if (pageUrlInput) pageUrlInput.value = window.location.href;

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 3500);
            } catch (err) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                setFormStatus('Could not send. Please try again or call us.', 'error');
            }
        });
    }


    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;
                window.scrollTo({
                    top: Math.max(0, targetTop),
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });


    // --- Tilt effect on program cards ---
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    }

});
