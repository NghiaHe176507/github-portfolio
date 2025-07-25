/* ============================================
   PORTFOLIO WEBSITE - COMPLETE JAVASCRIPT v2.1
   ============================================ */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        typewriterSpeed: 100,
        typewriterDelay: 1000,
        animationDuration: 800,
        scrollOffset: 80,
        particleCount: 50,
        typedTexts: [
            'Java Developer (Fresher)',
            'Java Developer (Fresher)', 
            'Java Developer (Fresher)',
            'Java Developer (Fresher)',
            'Java Developer (Fresher)'
        ]
    };

    // ===== DOM ELEMENTS =====
    const elements = {
        loadingScreen: document.getElementById('loading-screen'),
        navbar: document.querySelector('.navbar'),
        navLinks: document.querySelectorAll('.nav-link'),
        themeSwitcher: document.querySelector('.theme-switcher'),
        backToTop: document.getElementById('backToTop'),
        heroTitle: document.querySelector('.hero-title'),
        typedText: document.querySelector('.typed-text'),
        cursor: document.querySelector('.cursor'),
        counters: document.querySelectorAll('.counter'),
        progressBars: document.querySelectorAll('.progress-bar'),
        contactForm: document.getElementById('contactForm'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        projectItems: document.querySelectorAll('.project-item'),
        particlesContainer: document.querySelector('.particles-container'),
        scrollIndicator: document.querySelector('.scroll-indicator')
    };

    // ===== UTILITY FUNCTIONS =====
    const utils = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        isInViewport: (element, offset = 0) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= -offset &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        animateNumber: (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                element.textContent = Math.floor(current);
                
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        },

        random: (min, max) => Math.random() * (max - min) + min,

        createElement: (tag, classes = [], attributes = {}) => {
            const element = document.createElement(tag);
            classes.forEach(cls => element.classList.add(cls));
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        }
    };

    // ===== LOADING SCREEN =====
    const loadingScreen = {
        init() {
            window.addEventListener('load', this.hide.bind(this));
        },

        hide() {
            if (elements.loadingScreen) {
                setTimeout(() => {
                    elements.loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        elements.loadingScreen.style.display = 'none';
                    }, 500);
                }, 1000);
            }
        }
    };

    // ===== NAVIGATION =====
    const navigation = {
        init() {
            this.handleScroll();
            this.setupSmoothScroll();
            this.setupActiveLinks();
            this.setupMobileMenu();
            
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 10));
        },

        handleScroll() {
            const scrolled = window.pageYOffset > 50;
            
            if (elements.navbar) {
                elements.navbar.classList.toggle('scrolled', scrolled);
            }
            
            this.updateActiveLinks();
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    
                    if (target) {
                        const offsetPosition = target.offsetTop - CONFIG.scrollOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupActiveLinks() {
            elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    elements.navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });
        },

        updateActiveLinks() {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        },

        setupMobileMenu() {
            elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                });
            });
        }
    };

    // ===== THEME SWITCHER =====
    const themeSwitcher = {
        init() {
            this.loadTheme();
            if (elements.themeSwitcher) {
                elements.themeSwitcher.addEventListener('click', this.toggleTheme.bind(this));
            }
            
            // High contrast mode (press 'H' key)
            window.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 'h' && e.ctrlKey) {
                    document.body.classList.toggle('high-contrast');
                }
            });
        },

        toggleTheme() {
            const isDark = document.body.classList.toggle('dark-theme');
            elements.themeSwitcher.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        },

        loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                if (elements.themeSwitcher) {
                    elements.themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
                }
            }
        }
    };

    // ===== TYPEWRITER EFFECT =====
    const typewriter = {
        currentTextIndex: 0,
        currentCharIndex: 0,
        isDeleting: false,
        
        init() {
            if (elements.typedText) {
                setTimeout(() => {
                    this.type();
                }, CONFIG.typewriterDelay);
            }
        },

        type() {
            const currentText = CONFIG.typedTexts[this.currentTextIndex];
            
            if (this.isDeleting) {
                elements.typedText.textContent = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                elements.typedText.textContent = currentText.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }

            let typeSpeed = this.isDeleting ? CONFIG.typewriterSpeed / 2 : CONFIG.typewriterSpeed;

            if (!this.isDeleting && this.currentCharIndex === currentText.length) {
                typeSpeed = 2000;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % CONFIG.typedTexts.length;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    };

    // ===== PARTICLES SYSTEM =====
    const particles = {
        particlesArray: [],

        init() {
            if (elements.particlesContainer) {
                this.createParticles();
                this.animateParticles();
                
                window.addEventListener('resize', utils.debounce(() => {
                    this.clearParticles();
                    this.createParticles();
                }, 250));
            }
        },

        createParticles() {
            for (let i = 0; i < CONFIG.particleCount; i++) {
                const particle = this.createParticle();
                elements.particlesContainer.appendChild(particle.element);
                this.particlesArray.push(particle);
            }
        },

        createParticle() {
            const element = utils.createElement('div', ['particle']);
            const size = utils.random(1, 3);
            const x = utils.random(0, window.innerWidth);
            const y = utils.random(0, window.innerHeight);
            const speedX = utils.random(-1, 1);
            const speedY = utils.random(-1, 1);
            
            element.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${utils.random(0.1, 0.5)});
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            return {
                element,
                x,
                y,
                speedX,
                speedY,
                size
            };
        },

        animateParticles() {
            this.particlesArray.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x <= 0 || particle.x >= window.innerWidth) {
                    particle.speedX *= -1;
                }
                if (particle.y <= 0 || particle.y >= window.innerHeight) {
                    particle.speedY *= -1;
                }

                particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
                particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));

                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });

            requestAnimationFrame(() => this.animateParticles());
        },

        clearParticles() {
            this.particlesArray.forEach(particle => {
                particle.element.remove();
            });
            this.particlesArray = [];
        }
    };

    // ===== COUNTERS ANIMATION =====
    const counters = {
        init() {
            this.observeCounters();
        },

        observeCounters() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.textContent);
                        this.animateCounter(counter, target);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            elements.counters.forEach(counter => {
                observer.observe(counter);
            });
        },

        animateCounter(element, target) {
            utils.animateNumber(element, target, 2000);
        }
    };

    // ===== PROGRESS BARS =====
    const progressBars = {
        init() {
            this.observeProgressBars();
        },

        observeProgressBars() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const width = progressBar.getAttribute('data-width');
                        
                        setTimeout(() => {
                            progressBar.style.width = width + '%';
                        }, 500);
                        
                        observer.unobserve(progressBar);
                    }
                });
            }, { threshold: 0.5 });

            elements.progressBars.forEach(bar => {
                observer.observe(bar);
            });
        }
    };

    // ===== PROJECT FILTER =====
    const projectFilter = {
        init() {
            elements.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const filter = e.target.getAttribute('data-filter');
                    this.filterProjects(filter);
                    this.updateActiveFilter(e.target);
                });
            });
        },

        filterProjects(filter) {
            elements.projectItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        if (item.classList.contains('hide')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        },

        updateActiveFilter(activeButton) {
            elements.filterButtons.forEach(button => {
                button.classList.remove('active');
            });
            activeButton.classList.add('active');
        }
    };

    // ===== BACK TO TOP =====
    const backToTop = {
        init() {
            if (elements.backToTop) {
                elements.backToTop.addEventListener('click', this.scrollToTop);
                window.addEventListener('scroll', utils.throttle(this.toggleVisibility.bind(this), 100));
            }
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        toggleVisibility() {
            if (elements.backToTop) {
                const scrolled = window.pageYOffset > 300;
                elements.backToTop.classList.toggle('show', scrolled);
            }
        }
    };

    // ===== CONTACT FORM =====
    const contactForm = {
        init() {
            if (elements.contactForm) {
                elements.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            }
        },

        handleSubmit(e) {
            e.preventDefault();
            
            const btn = elements.contactForm.querySelector('button[type="submit"]');
            const loader = btn.querySelector('.btn-loader');
            
            if (this.validateForm()) {
                // Show loading state
                btn.classList.add('btn-sending');
                btn.disabled = true;
                loader.style.display = 'inline-block';
                
                // Simulate sending (replace with actual API call)
                setTimeout(() => {
                    loader.style.display = 'none';
                    btn.classList.remove('btn-sending');
                    btn.innerHTML = '<i class="fas fa-check me-2"></i>Đã gửi!';
                    
                    // Reset form
                    elements.contactForm.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Gửi tin nhắn';
                    }, 3000);
                }, 2000);
            }
        },

        validateForm() {
            const inputs = elements.contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim() || (input.id === 'message' && input.value.trim().length < 10)) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }

                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            });

            return isValid;
        }
    };

    // ===== SCROLL ANIMATIONS =====
    const scrollAnimations = {
        init() {
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: CONFIG.animationDuration,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
            }

            window.addEventListener('scroll', utils.throttle(this.handleParallax.bind(this), 10));
        },

        handleParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background');
            
            parallaxElements.forEach(element => {
                const speed = scrolled * 0.5;
                element.style.transform = `translateY(${speed}px)`;
            });
        }
    };

    // ===== COPY TO CLIPBOARD =====
    const copyToClipboard = {
        init() {
            const copyElements = [...document.querySelectorAll('[data-copy="email"]'), ...document.querySelectorAll('[data-copy="phone"]')];
            
            copyElements.forEach(element => {
                element.style.cursor = 'pointer';
                element.title = 'Click to copy';
                
                element.addEventListener('click', (e) => {
                    const textToCopy = e.target.textContent.trim();
                    
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            this.showCopyMessage(e.target);
                        });
                    } else {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = textToCopy;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        this.showCopyMessage(e.target);
                    }
                });
            });
        },

        showCopyMessage(element) {
            const originalText = element.textContent;
            element.textContent = 'Copied!';
            element.style.color = '#10b981';
            
            setTimeout(() => {
                element.textContent = originalText;
                element.style.color = '';
            }, 2000);
        }
    };

    // ===== MAIN INITIALIZATION =====
    const app = {
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.start.bind(this));
            } else {
                this.start();
            }
        },

        start() {
            try {
                loadingScreen.init();
                navigation.init();
                themeSwitcher.init();
                typewriter.init();
                particles.init();
                counters.init();
                progressBars.init();
                projectFilter.init();
                backToTop.init();
                contactForm.init();
                scrollAnimations.init();
                copyToClipboard.init();

                this.setupScrollIndicator();

                console.log('Portfolio website initialized successfully!');
            } catch (error) {
                console.error('Error initializing portfolio:', error);
            }
        },

        setupScrollIndicator() {
            if (elements.scrollIndicator) {
                elements.scrollIndicator.addEventListener('click', () => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    };

    // Start the application
    app.init();

    // Expose app to global scope for debugging
    if (typeof window !== 'undefined') {
        window.PortfolioApp = app;
    }

})();
