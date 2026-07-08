(function () {
    'use strict';

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    function closeMobileNav(navMenu, mobileToggle) {
        navMenu.classList.remove('active', 'mobile-active');
        mobileToggle.setAttribute('aria-expanded', 'false');

        mobileToggle.querySelectorAll('span').forEach(function (span) {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }

    function initPreloader() {
        window.addEventListener('load', function () {
            var preloader = document.getElementById('preloader');
            if (!preloader) return;

            setTimeout(function () {
                preloader.style.opacity = '0';
                setTimeout(function () {
                    preloader.style.display = 'none';
                }, 1000);
            }, 900);
        });
    }

    function initHeader() {
        var header = document.querySelector('.header');
        if (!header) return;

        function setHeaderState() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }

        window.addEventListener('scroll', setHeaderState, { passive: true });
        setHeaderState();
    }

    function initMobileNav() {
        var mobileToggle = document.getElementById('mobileToggle');
        var navMenu = document.getElementById('navMenu');
        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', function () {
            var isActive = !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', isActive);
            navMenu.classList.toggle('mobile-active', isActive);
            mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');

            var spans = mobileToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = isActive ? 'rotate(45deg) translate(6px, 6px)' : 'none';
                spans[1].style.opacity = isActive ? '0' : '1';
                spans[2].style.transform = isActive ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileNav(navMenu, mobileToggle);
            });
        });
    }

    function initReveal() {
        var nodes = document.querySelectorAll('.reveal');
        if (!nodes.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

            nodes.forEach(function (node) {
                observer.observe(node);
            });
            return;
        }

        function revealVisibleNodes() {
            nodes.forEach(function (node) {
                if (node.getBoundingClientRect().top < window.innerHeight - 80) {
                    node.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', revealVisibleNodes, { passive: true });
        revealVisibleNodes();
    }

    function initHeroCarousel() {
        var slides = document.querySelectorAll('.slide');
        var dotsContainer = document.getElementById('sliderDots');
        if (!slides.length || !dotsContainer) return;

        var currentSlideIdx = 0;
        var slideInterval;

        slides.forEach(function (_, idx) {
            var dot = document.createElement('button');
            dot.className = idx === 0 ? 'dot active' : 'dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Navigate to slide ' + (idx + 1));
            dot.addEventListener('click', function () {
                jumpToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });

        var dots = dotsContainer.querySelectorAll('.dot');

        function updateSlideStates() {
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('active', idx === currentSlideIdx);
                dots[idx].classList.toggle('active', idx === currentSlideIdx);
            });
        }

        function nextSlide() {
            currentSlideIdx = (currentSlideIdx + 1) % slides.length;
            updateSlideStates();
        }

        function prevSlide() {
            currentSlideIdx = (currentSlideIdx - 1 + slides.length) % slides.length;
            updateSlideStates();
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        function jumpToSlide(idx) {
            currentSlideIdx = idx;
            updateSlideStates();
            resetSlideTimer();
        }

        var nextBtn = document.getElementById('nextSlide');
        var prevBtn = document.getElementById('prevSlide');

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                nextSlide();
                resetSlideTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                prevSlide();
                resetSlideTimer();
            });
        }

        resetSlideTimer();
    }

    function initParallaxHero() {
        var heroBg = document.getElementById('heroBg');
        if (!heroBg) return;

        window.addEventListener('scroll', function () {
            heroBg.style.transform = 'translateY(' + (window.pageYOffset * 0.4) + 'px)';
        }, { passive: true });
    }

    function initLightbox() {
        var triggers = document.querySelectorAll('[data-src]');
        if (!triggers.length) return;

        var lightbox = document.getElementById('galleryLightbox') || document.getElementById('masterLightbox');
        if (!lightbox) return;

        var image = lightbox.querySelector('img');
        var closeButton = lightbox.querySelector('button, .lightbox-close, .lightbox-close-btn, .lightbox-terminate-btn, .lightbox-close-trigger');
        if (!image) return;

        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            image.setAttribute('src', '');
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                var source = trigger.getAttribute('data-src');
                if (!source) return;

                image.setAttribute('src', source);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', close);
        }

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) close();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                close();
            }
        });
    }

    function initCounters() {
        var counters = document.querySelectorAll('.stat-numerical[data-ceiling]');
        if (!counters.length) return;

        var triggered = false;

        function runCounters() {
            counters.forEach(function (counter) {
                var ceiling = parseInt(counter.getAttribute('data-ceiling'), 10);
                var value = 0;
                var step = Math.max(1, ceiling / 80);

                function tick() {
                    value += step;
                    if (value < ceiling) {
                        counter.innerText = Math.ceil(value).toLocaleString();
                        setTimeout(tick, 20);
                        return;
                    }

                    counter.innerText = ceiling.toLocaleString() + (ceiling === 98 ? '%' : '+');
                }

                tick();
            });
        }

        function checkCounters() {
            if (triggered || counters[0].getBoundingClientRect().top >= window.innerHeight) return;
            triggered = true;
            runCounters();
            window.removeEventListener('scroll', checkCounters);
        }

        window.addEventListener('scroll', checkCounters, { passive: true });
        checkCounters();
    }

    function initTrackSlider() {
        var track = document.getElementById('testimonialTrack');
        if (!track) return;

        var dots = document.querySelectorAll('.slider-dot[data-index], .luxury-dot-item[data-slide]');
        if (!dots.length) return;

        var current = 0;
        var timer;

        function getIndex(dot) {
            return parseInt(dot.getAttribute('data-index') || dot.getAttribute('data-slide'), 10);
        }

        function update(targetIndex) {
            track.style.transform = 'translateX(-' + (targetIndex * 33.3333) + '%)';
            dots.forEach(function (dot) {
                dot.classList.toggle('active', getIndex(dot) === targetIndex);
            });
            current = targetIndex;
        }

        function restart() {
            clearInterval(timer);
            timer = setInterval(function () {
                update((current + 1) % dots.length);
            }, 6000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                update(getIndex(dot));
                restart();
            });
        });

        restart();
    }

    function initReviewSlides() {
        var slides = document.querySelectorAll('.review-slide');
        if (!slides.length) return;

        var current = 0;
        setInterval(function () {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000);
    }

    function initParticleCanvas() {
        var canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var dots = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function seedDots() {
            dots = [];
            for (var i = 0; i < 35; i += 1) {
                dots.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.5 + 0.5,
                    v: Math.random() * 0.4 + 0.1
                });
            }
        }

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(200, 155, 60, 0.3)';
            dots.forEach(function (dot) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                ctx.fill();
                dot.y -= dot.v;
                if (dot.y < 0) dot.y = canvas.height;
            });
            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', function () {
            resize();
            seedDots();
        });

        resize();
        seedDots();
        loop();
    }

    function initForms() {
        document.querySelectorAll('form[data-form-message]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                alert(form.getAttribute('data-form-message'));
                form.reset();
            });
        });
    }

    initPreloader();

    ready(function () {
        initHeader();
        initMobileNav();
        initReveal();
        initHeroCarousel();
        initParallaxHero();
        initLightbox();
        initCounters();
        initTrackSlider();
        initReviewSlides();
        initParticleCanvas();
        initForms();
    });
}());
