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

    var ticking = false;
    function update() {
      if (!ticking) {
        requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
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
    var overlay = document.getElementById('navOverlay');
    var closeBtn = document.getElementById('mobileClose');
    if (!toggle || !nav) return;

    var previouslyFocusedElement = null;

    function getFocusableElements() {
      return nav.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    }

    function openMenu() {
      previouslyFocusedElement = document.activeElement;
      nav.classList.add('active');
      if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
      }
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      
      // Focus on first element inside drawer after animation
      setTimeout(function() {
        if (closeBtn) closeBtn.focus();
      }, 450);
    }

    function closeMenu() {
      nav.classList.remove('active');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      }
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      
      var spans = toggle.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }

      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Focus trap inside the drawer
    nav.addEventListener('keydown', function(e) {
      var isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      var focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      
      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
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

    var heroData = [];
    function calculateBounds() {
      heroData = [];
      heroes.forEach(function (img) {
        var container = img.closest('.hero');
        if (container) {
          var rect = container.getBoundingClientRect();
          heroData.push({
            img: img,
            top: rect.top + window.scrollY,
            height: rect.height
          });
        }
      });
    }

    // Delay calculation slightly to ensure layout is settled
    setTimeout(calculateBounds, 100);
    window.addEventListener('resize', calculateBounds, { passive: true });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          var winHeight = window.innerHeight;
          heroData.forEach(function (data) {
            if (data.top < scrollY + winHeight && data.top + data.height > scrollY) {
              data.img.style.transform = 'translate3d(0, ' + (scrollY * 0.15) + 'px, 0) scale(1.08)';
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
     Active Navigation State
     ========================================================================== */
  function initActiveNav() {
    var path = window.location.pathname;
    var normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    
    var navLinks = document.querySelectorAll('.nav-links a:not(.btn-book)');
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      var linkURL;
      try {
        linkURL = new URL(href, window.location.origin).pathname;
      } catch (e) {
        return; // Skip invalid URLs
      }
      var normalizedLink = linkURL.endsWith('/') && linkURL.length > 1 ? linkURL.slice(0, -1) : linkURL;
      
      if (normalizedPath === normalizedLink) {
        link.classList.add('current-page');
      } else if (normalizedPath !== '/' && normalizedPath !== '/varda-resort' && normalizedLink !== '/' && normalizedLink !== '/varda-resort' && normalizedPath.startsWith(normalizedLink)) {
        link.classList.add('current-page');
      }
    });
  }

  /* ==========================================================================
     Booking Flow
     ========================================================================== */
  function initBookingFlow() {
    // 1. Homepage Widget -> Save to sessionStorage & Validate
    var quickForm = document.querySelector('.quick-booking-form');
    if (quickForm) {
      quickForm.addEventListener('submit', function (e) {
        var checkin = document.getElementById('booking_checkin');
        var checkout = document.getElementById('booking_checkout');
        var guests = document.getElementById('booking_guests');
        
        if (!checkin || !checkout || !guests) return;
        
        if (!checkin.value || !checkout.value || !guests.value) {
          e.preventDefault();
          alert('Please select Check In, Check Out, and Guests.');
          return;
        }

        // Save to session storage for fallback
        sessionStorage.setItem('varda_booking_checkin', checkin.value);
        sessionStorage.setItem('varda_booking_checkout', checkout.value);
        sessionStorage.setItem('varda_booking_guests', guests.value);
      });
      
      // Auto-fill from sessionStorage if coming back
      var savedCheckin = sessionStorage.getItem('varda_booking_checkin');
      var savedCheckout = sessionStorage.getItem('varda_booking_checkout');
      var savedGuests = sessionStorage.getItem('varda_booking_guests');
      
      var ciInput = document.getElementById('booking_checkin');
      var coInput = document.getElementById('booking_checkout');
      var gInput = document.getElementById('booking_guests');
      
      if (ciInput && savedCheckin) ciInput.value = savedCheckin;
      if (coInput && savedCheckout) coInput.value = savedCheckout;
      if (gInput && savedGuests) gInput.value = savedGuests;
    }

    // 2. Booking Page -> Populate from URL or sessionStorage
    var bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      var urlParams = new URLSearchParams(window.location.search);
      
      var checkinVal = urlParams.get('checkin') || sessionStorage.getItem('varda_booking_checkin');
      var checkoutVal = urlParams.get('checkout') || sessionStorage.getItem('varda_booking_checkout');
      var guestsVal = urlParams.get('guests') || sessionStorage.getItem('varda_booking_guests');

      if (checkinVal) {
        var bCiInput = document.getElementById('checkin');
        if (bCiInput) {
          bCiInput.value = checkinVal;
          bCiInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
      if (checkoutVal) {
        var bCoInput = document.getElementById('checkout');
        if (bCoInput) {
          bCoInput.value = checkoutVal;
          bCoInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
      if (guestsVal) {
        var bgInput = document.getElementById('guests');
        if (bgInput) {
          bgInput.value = guestsVal;
          bgInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }

  /* ==========================================================================
     Booking Form Submission
     ========================================================================== */
  function setupBookingSubmission() {
    var form = document.getElementById('booking-form');
    if (!form) return;

    var BOOKING_API_URL = "PASTE_GOOGLE_APPS_SCRIPT_URL_HERE";
    var overlay = document.getElementById('booking-modal-overlay');
    var successModal = document.getElementById('booking-success-modal');
    var errorModal = document.getElementById('booking-error-modal');
    
    // Close modal handlers
    var closeBtns = document.querySelectorAll('.btn-close-modal');
    closeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (overlay) overlay.style.display = 'none';
        if (successModal) successModal.style.display = 'none';
        if (errorModal) errorModal.style.display = 'none';
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      if (!btn || btn.disabled) return;

      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      btn.style.opacity = '0.7';

      var formData = new FormData(form);
      var payload = {
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        room_type: formData.get('room_type'),
        guests: formData.get('guests'),
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        special_requests: formData.get('special_requests')
      };

      fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Standard for avoiding CORS preflight in GAS
        },
        body: JSON.stringify(payload)
      })
      .then(function(response) {
        if (response.ok || response.type === 'opaque') {
          // Success
          if (overlay) overlay.style.display = 'flex';
          if (successModal) successModal.style.display = 'block';
          form.reset();
        } else {
          // Failure
          if (overlay) overlay.style.display = 'flex';
          if (errorModal) errorModal.style.display = 'block';
          console.error('Booking submission failed with status:', response.status);
        }
      })
      .catch(function(error) {
        // Network error or CORS issue
        if (overlay) overlay.style.display = 'flex';
        if (errorModal) errorModal.style.display = 'block';
        console.error('Booking submission error:', error);
      })
      .finally(function() {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.opacity = '1';
      });
    });
  }

  /* ==========================================================================
     Initialize Everything
     ========================================================================== */
  ready(function () {
    initHeader();
    initMobileNav();
    initActiveNav();
    initReveal();
    initCounters();
    initParallax();
    initLightbox();
    initTestimonialSlider();
    initAccordion();
    initSmoothScroll();
    initLazyImages();
    initForms();
    initBookingFlow();
    setupBookingSubmission();
  });
}());
