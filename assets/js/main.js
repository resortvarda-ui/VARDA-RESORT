(function () {
  'use strict';

  /* ==========================================================================
     Utilities
     ========================================================================== */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ==========================================================================
     Header — Transparent to Glass on Scroll
     ========================================================================== */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ==========================================================================
     Mobile Navigation
     ========================================================================== */
  function initMobileNav() {
    var toggle = document.getElementById('mobileToggle');
    var nav = document.getElementById('navMenu');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('active');
      nav.classList.toggle('active', open);
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        var spans = toggle.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  /* ==========================================================================
     Reveal on Scroll — IntersectionObserver
     ========================================================================== */
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, .reveal-up');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.classList.add('active'); // for reveal-up
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

      els.forEach(function (el) { observer.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('revealed'); el.classList.add('active'); });
    }
  }

  /* ==========================================================================
     Animated Counters
     ========================================================================== */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ==========================================================================
     Parallax Hero
     ========================================================================== */
  function initParallax() {
    var heroes = document.querySelectorAll('.hero-img');
    if (!heroes.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          heroes.forEach(function (img) {
            var rect = img.closest('.hero').getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              img.style.transform = 'translateY(' + (scrollY * 0.15) + 'px) scale(1.08)';
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     Lightbox Gallery
     ========================================================================== */
  function initLightbox() {
    var triggers = document.querySelectorAll('[data-lightbox]');
    if (!triggers.length) return;

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<img src="" alt="Gallery Image">';
    document.body.appendChild(lightbox);
    var lbImg = lightbox.querySelector('img');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img').src;
        lbImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
      }
    });
  }

  /* ==========================================================================
     Testimonial Slider
     ========================================================================== */
  function initTestimonialSlider() {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonial-dot');
    if (!slides.length) return;

    var current = 0;
    var timer;

    function showSlide(idx) {
      slides.forEach(function (s, i) {
        s.style.opacity = i === idx ? '1' : '0';
        s.style.visibility = i === idx ? 'visible' : 'hidden';
        s.style.position = i === idx ? 'relative' : 'absolute';
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });
      current = idx;
    }

    function next() {
      showSlide((current + 1) % slides.length);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  /* ==========================================================================
     Accordion
     ========================================================================== */
  function initAccordion() {
    var headers = document.querySelectorAll('.accordion-header');
    headers.forEach(function (header) {
      header.addEventListener('click', function () {
        var item = header.closest('.accordion-item');
        var isActive = item.classList.contains('active');

        item.closest('.accordion').querySelectorAll('.accordion-item').forEach(function (i) {
          i.classList.remove('active');
        });

        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     Booking Dialog
     ========================================================================== */
  function initBookingDialog() {
    var overlay = document.getElementById('bookingOverlay');
    var closeBtn = document.getElementById('closeBooking');
    if (!overlay) return;

    var triggers = document.querySelectorAll('[data-booking]');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  /* ==========================================================================
     Smooth Scroll for Anchor Links
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ==========================================================================
     Image Lazy Load with Fade
     ========================================================================== */
  function initLazyImages() {
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(function (img) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function () {
          img.style.opacity = '1';
        });
      }
    });
  }

  /* ==========================================================================
     Form Handling
     ========================================================================== */
  function initForms() {
    var forms = document.querySelectorAll('form[data-ajax]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';

        var data = new FormData(form);

        fetch(form.action, {
          method: form.method || 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function (res) {
          if (res.ok) {
            form.innerHTML = '<div style="text-align:center;padding:40px 0"><h3 style="font-family:var(--font-display);font-size:2rem;color:var(--gold);margin-bottom:16px">Thank You</h3><p style="color:var(--text-muted)">Your inquiry has been received. We will be in touch shortly.</p></div>';
          } else {
            btn.textContent = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          }
        }).catch(function () {
          btn.textContent = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        });
      });
    });
  }

  /* ==========================================================================
     Initialize Everything
     ========================================================================== */
  ready(function () {
    initHeader();
    initMobileNav();
    initReveal();
    initCounters();
    initParallax();
    initLightbox();
    initTestimonialSlider();
    initAccordion();
    initBookingDialog();
    initSmoothScroll();
    initLazyImages();
    initForms();
  });
}());
