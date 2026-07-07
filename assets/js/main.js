(function () {
    'use strict';

    // Preloader dismissal
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;

        setTimeout(function () {
            preloader.style.opacity = '0';
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 1000);
        }, 1200);
    });

    // Sticky header on scroll
    var header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile navigation toggle
    var mobileToggle = document.getElementById('mobileToggle');
    var navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            var isActive = navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');

            var spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = isActive ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = isActive ? '0' : '1';
            spans[2].style.transform = isActive ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });

        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                var spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Hero carousel
    var slides = document.querySelectorAll('.slide');
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');
    var dotsContainer = document.getElementById('sliderDots');

    if (!slides.length || !dotsContainer) return;

    var currentSlideIdx = 0;
    var slideInterval;

    slides.forEach(function (_, idx) {
        var dot = document.createElement('button');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Navigate to slide ' + (idx + 1));
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', function () {
            jumpToSlide(idx);
        });
        dotsContainer.appendChild(dot);
    });

    var dots = document.querySelectorAll('.dot');

    function updateSlideStates() {
        slides.forEach(function (slide, idx) {
            slide.classList.remove('active');
            dots[idx].classList.remove('active');
        });
        slides[currentSlideIdx].classList.add('active');
        dots[currentSlideIdx].classList.add('active');
    }

    function nextSlide() {
        currentSlideIdx = (currentSlideIdx + 1) % slides.length;
        updateSlideStates();
    }

    function prevSlide() {
        currentSlideIdx = (currentSlideIdx - 1 + slides.length) % slides.length;
        updateSlideStates();
    }

    function jumpToSlide(idx) {
        currentSlideIdx = idx;
        updateSlideStates();
        resetSlideTimer();
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

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
})();
