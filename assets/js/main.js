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
            // Slight timeout ensures smooth class application without blocking rendering thread
            setTimeout(function() {
              entry.target.classList.add('revealed');
              entry.target.classList.add('active'); // for reveal-up
            }, 50);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

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
        // Exponential ease out for a more elegant deceleration
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
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
              // Subtler, smoother parallax effect (0.1 instead of 0.15)
              data.img.style.transform = 'translate3d(0, ' + (scrollY * 0.1) + 'px, 0) scale(1.05)';
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
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
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

    // Keyboard arrow navigation on the slider region
    var sliderEl = document.querySelector('.testimonials-slider');
    if (sliderEl) {
      sliderEl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { next(); startTimer(); }
        if (e.key === 'ArrowLeft') { showSlide((current - 1 + slides.length) % slides.length); startTimer(); }
      });
    }

    // Pause on hover / focus for accessibility
    var trackEl = document.querySelector('.testimonials-track');
    if (trackEl) {
      trackEl.addEventListener('mouseenter', function () { clearInterval(timer); });
      trackEl.addEventListener('mouseleave', startTimer);
      trackEl.addEventListener('focusin', function () { clearInterval(timer); });
      trackEl.addEventListener('focusout', startTimer);
    }

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
     Shared Validation Utilities
     ========================================================================== */

  /**
   * Validate Indian mobile number:
   * - exactly 10 digits
   * - first digit must be 6, 7, 8, or 9
   */
  function validatePhone(val) {
    var digits = val.replace(/\D/g, '');
    if (digits.length !== 10) return false;
    return /^[6-9]/.test(digits);
  }

  /**
   * Validate email with strict regex.
   * Rejects: abc@, abc.com, abc@com, abc@.com, spaces, etc.
   */
  function validateEmail(val) {
    var trimmed = val.trim();
    // Must have: local@domain.tld
    // local: no whitespace or @
    // domain: no whitespace or @
    // tld: 2+ non-whitespace, non-@ chars after final dot
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
  }

  /** Validate non-empty, non-whitespace string. */
  function validateNotEmpty(val) {
    return typeof val === 'string' && val.trim().length > 0;
  }

  /**
   * Validate a date string is today or in the future.
   * Compares only the date portion (ignores time).
   */
  function validateDateNotPast(val) {
    if (!val) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var d = new Date(val + 'T00:00:00');
    return d >= today;
  }

  /**
   * Validate checkout is strictly after checkin.
   */
  function validateDateRange(checkinVal, checkoutVal) {
    if (!checkinVal || !checkoutVal) return false;
    var ci = new Date(checkinVal + 'T00:00:00');
    var co = new Date(checkoutVal + 'T00:00:00');
    return co > ci;
  }

  /* -------- Inline Field Error Helpers -------- */

  function showFieldError(input, message) {
    input.classList.add('has-error');
    input.classList.remove('has-success');
    // Remove any existing error for this field
    var existing = input.parentNode.querySelector('.field-error-msg');
    if (existing) existing.remove();
    var err = document.createElement('span');
    err.className = 'field-error-msg';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    input.parentNode.appendChild(err);
  }

  function clearFieldError(input) {
    input.classList.remove('has-error');
    var existing = input.parentNode ? input.parentNode.querySelector('.field-error-msg') : null;
    if (existing) existing.remove();
  }

  function markFieldValid(input) {
    input.classList.remove('has-error');
    input.classList.add('has-success');
    var existing = input.parentNode ? input.parentNode.querySelector('.field-error-msg') : null;
    if (existing) existing.remove();
  }

  function focusFirstError(form) {
    var firstErr = form.querySelector('.has-error');
    if (firstErr) {
      firstErr.focus();
      firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* -------- Button State Helpers -------- */

  function setBtnLoading(btn) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = btn.dataset.loadingText ||
      '<span style="display:inline-flex;align-items:center;gap:0.5rem">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:varda-spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
      + (btn.dataset.loadingLabel || 'Sending...')
      + '</span>';
    btn.classList.add('btn-loading');
  }

  function resetBtn(btn) {
    btn.disabled = false;
    if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
    btn.classList.remove('btn-loading');
  }

  /* -------- Modal Helpers -------- */

  function showModal(overlay, modal) {
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
    }
    if (modal) {
      modal.style.display = 'block';
      // Focus the close button inside modal for accessibility
      setTimeout(function() {
        var closeBtn = modal.querySelector('.btn-close-modal');
        if (closeBtn) closeBtn.focus();
      }, 80);
    }
  }

  function hideModals(overlay, modals) {
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    modals.forEach(function(m) { if (m) m.style.display = 'none'; });
  }

  function bindCloseModals(overlay, modals, triggerSelector) {
    var triggers = document.querySelectorAll(triggerSelector);
    triggers.forEach(function(btn) {
      btn.addEventListener('click', function() { hideModals(overlay, modals); });
    });
    // Dismiss on overlay backdrop click
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) hideModals(overlay, modals);
      });
    }
    // Dismiss on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
        hideModals(overlay, modals);
      }
    });
  }

  /* ==========================================================================
     Form Handling (legacy data-ajax forms — kept for compatibility)
     ========================================================================== */
  function initForms() {
    // No-op: legacy handler removed. All forms are handled by
    // setupContactSubmission() and setupBookingSubmission() below.
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
     Booking Flow — Date Constraints & Pre-fill from URL / sessionStorage
     ========================================================================== */
  function initBookingFlow() {
    // ---- Shared: set today's date as the minimum for all date inputs ----
    var todayStr = (function() {
      var d = new Date();
      var mm = ('0' + (d.getMonth() + 1)).slice(-2);
      var dd = ('0' + d.getDate()).slice(-2);
      return d.getFullYear() + '-' + mm + '-' + dd;
    }());

    // ---- Homepage Quick-Booking Widget ----
    var quickForm = document.querySelector('.quick-booking-form');
    if (quickForm) {
      var qCI = document.getElementById('booking_checkin');
      var qCO = document.getElementById('booking_checkout');
      var qGuests = document.getElementById('booking_guests');

      if (qCI) qCI.setAttribute('min', todayStr);
      if (qCO) qCO.setAttribute('min', todayStr);

      // When checkin changes, update checkout minimum
      if (qCI && qCO) {
        qCI.addEventListener('change', function() {
          if (qCI.value) {
            qCO.setAttribute('min', qCI.value);
            // If existing checkout is now invalid, clear it
            if (qCO.value && qCO.value <= qCI.value) {
              qCO.value = '';
              clearFieldError(qCO);
            }
          }
        });
      }

      quickForm.addEventListener('submit', function(e) {
        if (!qCI || !qCO || !qGuests) return;
        var hasError = false;

        // Validate check-in
        if (!qCI.value || !validateDateNotPast(qCI.value)) {
          showFieldError(qCI, 'Please select a valid check-in date.');
          hasError = true;
        } else {
          clearFieldError(qCI);
        }

        // Validate check-out
        if (!qCO.value) {
          showFieldError(qCO, 'Please select a check-out date.');
          hasError = true;
        } else if (!validateDateRange(qCI.value, qCO.value)) {
          showFieldError(qCO, 'Check-out must be after check-in.');
          hasError = true;
        } else {
          clearFieldError(qCO);
        }

        // Validate guests
        if (!qGuests.value) {
          showFieldError(qGuests, 'Please select number of guests.');
          hasError = true;
        } else {
          clearFieldError(qGuests);
        }

        if (hasError) {
          e.preventDefault();
          focusFirstError(quickForm);
          return;
        }

        // Save to sessionStorage so booking page can pre-fill
        sessionStorage.setItem('varda_booking_checkin', qCI.value);
        sessionStorage.setItem('varda_booking_checkout', qCO.value);
        sessionStorage.setItem('varda_booking_guests', qGuests.value);
      });

      // Auto-fill from sessionStorage on return visit
      var sCi = sessionStorage.getItem('varda_booking_checkin');
      var sCo = sessionStorage.getItem('varda_booking_checkout');
      var sG  = sessionStorage.getItem('varda_booking_guests');
      if (qCI && sCi) qCI.value = sCi;
      if (qCO && sCo) qCO.value = sCo;
      if (qGuests && sG) qGuests.value = sG;
    }

    // ---- Booking Page: Pre-fill from URL params or sessionStorage ----
    var bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      var urlParams = new URLSearchParams(window.location.search);
      var bCI = document.getElementById('checkin');
      var bCO = document.getElementById('checkout');
      var bGuests = document.getElementById('guests');

      // Set minimum dates
      if (bCI) bCI.setAttribute('min', todayStr);
      if (bCO) bCO.setAttribute('min', todayStr);

      // Checkout min follows checkin
      if (bCI && bCO) {
        bCI.addEventListener('change', function() {
          if (bCI.value) {
            bCO.setAttribute('min', bCI.value);
            if (bCO.value && bCO.value <= bCI.value) {
              bCO.value = '';
              clearFieldError(bCO);
            }
          }
          // Re-validate checkin live
          if (bCI.value && validateDateNotPast(bCI.value)) {
            markFieldValid(bCI);
          }
        });
        bCO.addEventListener('change', function() {
          if (bCO.value && bCI.value && validateDateRange(bCI.value, bCO.value)) {
            markFieldValid(bCO);
          }
        });
      }

      // Pre-fill values
      var preCI = urlParams.get('checkin') || sessionStorage.getItem('varda_booking_checkin');
      var preCO = urlParams.get('checkout') || sessionStorage.getItem('varda_booking_checkout');
      var preG  = urlParams.get('guests')  || sessionStorage.getItem('varda_booking_guests');

      if (bCI && preCI) { bCI.value = preCI; bCI.dispatchEvent(new Event('change', { bubbles: true })); }
      if (bCO && preCO) { bCO.value = preCO; bCO.dispatchEvent(new Event('change', { bubbles: true })); }
      if (bGuests && preG) { bGuests.value = preG; }
    }
  }

  /* ==========================================================================
     Booking Form Submission — With Full Validation
     ========================================================================== */
  function setupBookingSubmission() {
    var form = document.getElementById('booking-form');
    if (!form) return;

    var BOOKING_API_URL = 'https://script.google.com/macros/s/AKfycbwy_Y0JjdujZuXRRoAIXcrzPfEUkMw0CFhqCZt22O1xVygh2d0-REzagePZfSixkHB2/exec';
    var overlay      = document.getElementById('booking-modal-overlay');
    var successModal = document.getElementById('booking-success-modal');
    var errorModal   = document.getElementById('booking-error-modal');

    bindCloseModals(overlay, [successModal, errorModal], '#booking-modal-overlay .btn-close-modal');

    // ---- Phone: block non-numeric characters on input ----
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        var clean = phoneInput.value.replace(/\D/g, '');
        if (phoneInput.value !== clean) phoneInput.value = clean;
        // Live validation feedback once the user has typed something
        if (clean.length > 0) {
          if (!validatePhone(clean)) {
            showFieldError(phoneInput, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
          } else {
            markFieldValid(phoneInput);
          }
        } else {
          clearFieldError(phoneInput);
        }
      });
      phoneInput.addEventListener('blur', function() {
        var v = phoneInput.value.trim();
        if (v.length > 0 && !validatePhone(v)) {
          showFieldError(phoneInput, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
        } else if (v.length > 0) {
          markFieldValid(phoneInput);
        }
      });
    }

    // ---- Email: validate on blur ----
    var emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        var v = emailInput.value.trim();
        if (v.length > 0 && !validateEmail(v)) {
          showFieldError(emailInput, 'Please enter a valid email address (e.g. name@domain.com).');
        } else if (v.length > 0) {
          markFieldValid(emailInput);
        }
      });
      emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('has-error') && validateEmail(emailInput.value.trim())) {
          markFieldValid(emailInput);
        }
      });
    }

    // ---- Full Name: validate on blur ----
    var nameInput = document.getElementById('full-name');
    if (nameInput) {
      nameInput.addEventListener('blur', function() {
        if (!validateNotEmpty(nameInput.value)) {
          showFieldError(nameInput, 'Full name is required.');
        } else {
          markFieldValid(nameInput);
        }
      });
      nameInput.addEventListener('input', function() {
        if (nameInput.classList.contains('has-error') && validateNotEmpty(nameInput.value)) {
          markFieldValid(nameInput);
        }
      });
    }

    // ---- Form submission ----
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Prevent duplicate submissions
      if (form.dataset.submitting === 'true') return;

      var isValid = true;

      // Validate Check-in
      var ci = document.getElementById('checkin');
      if (!ci || !ci.value || !validateDateNotPast(ci.value)) {
        showFieldError(ci, 'Please select a valid check-in date (today or later).');
        isValid = false;
      } else {
        markFieldValid(ci);
      }

      // Validate Check-out
      var co = document.getElementById('checkout');
      var ciVal = ci ? ci.value : '';
      if (!co || !co.value) {
        showFieldError(co, 'Please select a check-out date.');
        isValid = false;
      } else if (!validateDateRange(ciVal, co.value)) {
        showFieldError(co, 'Check-out must be at least one day after check-in.');
        isValid = false;
      } else {
        markFieldValid(co);
      }

      // Validate Room Type
      var roomType = document.getElementById('room-type');
      if (!roomType || !roomType.value) {
        showFieldError(roomType, 'Please select a room type.');
        isValid = false;
      } else {
        markFieldValid(roomType);
      }

      // Validate Guests
      var guests = document.getElementById('guests');
      if (!guests || !guests.value) {
        showFieldError(guests, 'Please select number of guests.');
        isValid = false;
      } else {
        markFieldValid(guests);
      }

      // Validate Full Name
      var fullName = document.getElementById('full-name');
      if (!fullName || !validateNotEmpty(fullName.value)) {
        showFieldError(fullName, 'Full name is required.');
        isValid = false;
      } else {
        markFieldValid(fullName);
      }

      // Validate Email
      var emailEl = document.getElementById('email');
      if (!emailEl || !emailEl.value.trim()) {
        showFieldError(emailEl, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailEl.value)) {
        showFieldError(emailEl, 'Please enter a valid email address (e.g. name@domain.com).');
        isValid = false;
      } else {
        markFieldValid(emailEl);
      }

      // Validate Phone (if provided — validate format; booking phone is optional)
      var phoneEl = document.getElementById('phone');
      if (phoneEl && phoneEl.value.trim().length > 0) {
        if (!validatePhone(phoneEl.value)) {
          showFieldError(phoneEl, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
          isValid = false;
        } else {
          markFieldValid(phoneEl);
        }
      } else if (phoneEl) {
        clearFieldError(phoneEl);
      }

      if (!isValid) {
        focusFirstError(form);
        return;
      }

      // ---- All valid — submit ----
      form.dataset.submitting = 'true';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.dataset.loadingLabel = 'Submitting…';
        setBtnLoading(btn);
      }

      var payload = {
        type:             'booking',
        checkin:          ci  ? ci.value  : '',
        checkout:         co  ? co.value  : '',
        room_type:        roomType  ? roomType.value  : '',
        guests:           guests    ? guests.value    : '',
        full_name:        fullName  ? fullName.value.trim()  : '',
        email:            emailEl   ? emailEl.value.trim()   : '',
        phone:            phoneEl   ? phoneEl.value.trim()   : '',
        special_requests: (form.querySelector('#requests') || { value: '' }).value.trim()
      };

      // Timeout guard: if no response in 15s, show error
      var timeoutId = setTimeout(function() {
        form.dataset.submitting = 'false';
        if (btn) resetBtn(btn);
        showModal(overlay, errorModal);
      }, 15000);

      fetch(BOOKING_API_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS always returns opaque; handle optimistically
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
      .then(function() {
        clearTimeout(timeoutId);
        // Successful network request (opaque response = GAS received it)
        showModal(overlay, successModal);
        form.reset();
        // Clear all validation states
        form.querySelectorAll('.has-success, .has-error').forEach(function(el) {
          el.classList.remove('has-success', 'has-error');
        });
        form.querySelectorAll('.field-error-msg').forEach(function(el) { el.remove(); });
      })
      .catch(function(err) {
        clearTimeout(timeoutId);
        console.error('Booking submission error:', err);
        showModal(overlay, errorModal);
      })
      .finally(function() {
        form.dataset.submitting = 'false';
        if (btn) resetBtn(btn);
      });
    });
  }

  /* ==========================================================================
     Contact Form Submission — With Full Validation
     ========================================================================== */
  function setupContactSubmission() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbwy_Y0JjdujZuXRRoAIXcrzPfEUkMw0CFhqCZt22O1xVygh2d0-REzagePZfSixkHB2/exec';
    var overlay      = document.getElementById('contact-modal-overlay');
    var successModal = document.getElementById('contact-success-modal');
    var errorModal   = document.getElementById('contact-error-modal');

    bindCloseModals(overlay, [successModal, errorModal], '#contact-modal-overlay .btn-close-modal');

    // ---- Phone: block non-numeric on input, validate live ----
    var contactPhone = form.querySelector('input[name="phone"]');
    if (contactPhone) {
      contactPhone.addEventListener('input', function() {
        var clean = contactPhone.value.replace(/\D/g, '');
        if (contactPhone.value !== clean) contactPhone.value = clean;
        if (clean.length > 0) {
          if (!validatePhone(clean)) {
            showFieldError(contactPhone, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
          } else {
            markFieldValid(contactPhone);
          }
        } else {
          clearFieldError(contactPhone); // Phone is optional in contact form
        }
      });
      contactPhone.addEventListener('blur', function() {
        var v = contactPhone.value.trim();
        if (v.length > 0 && !validatePhone(v)) {
          showFieldError(contactPhone, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
        } else if (v.length > 0) {
          markFieldValid(contactPhone);
        }
      });
    }

    // ---- Email: validate on blur ----
    var contactEmail = form.querySelector('input[name="email"]');
    if (contactEmail) {
      contactEmail.addEventListener('blur', function() {
        var v = contactEmail.value.trim();
        if (!v) {
          showFieldError(contactEmail, 'Email address is required.');
        } else if (!validateEmail(v)) {
          showFieldError(contactEmail, 'Please enter a valid email address (e.g. name@domain.com).');
        } else {
          markFieldValid(contactEmail);
        }
      });
      contactEmail.addEventListener('input', function() {
        if (contactEmail.classList.contains('has-error') && validateEmail(contactEmail.value.trim())) {
          markFieldValid(contactEmail);
        }
      });
    }

    // ---- Name: validate on blur ----
    var contactName = form.querySelector('input[name="name"]');
    if (contactName) {
      contactName.addEventListener('blur', function() {
        if (!validateNotEmpty(contactName.value)) {
          showFieldError(contactName, 'Full name is required.');
        } else {
          markFieldValid(contactName);
        }
      });
      contactName.addEventListener('input', function() {
        if (contactName.classList.contains('has-error') && validateNotEmpty(contactName.value)) {
          markFieldValid(contactName);
        }
      });
    }

    // ---- Message: validate on blur ----
    var contactMsg = form.querySelector('textarea[name="message"]');
    if (contactMsg) {
      contactMsg.addEventListener('blur', function() {
        if (!validateNotEmpty(contactMsg.value)) {
          showFieldError(contactMsg, 'Please tell us about your requirements.');
        } else {
          markFieldValid(contactMsg);
        }
      });
      contactMsg.addEventListener('input', function() {
        if (contactMsg.classList.contains('has-error') && validateNotEmpty(contactMsg.value)) {
          markFieldValid(contactMsg);
        }
      });
    }

    // ---- Form submission ----
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (form.dataset.submitting === 'true') return;

      var isValid = true;

      // Validate Name
      var nameEl = form.querySelector('input[name="name"]');
      if (!nameEl || !validateNotEmpty(nameEl.value)) {
        showFieldError(nameEl, 'Full name is required.');
        isValid = false;
      } else {
        markFieldValid(nameEl);
      }

      // Validate Email
      var emailEl = form.querySelector('input[name="email"]');
      if (!emailEl || !emailEl.value.trim()) {
        showFieldError(emailEl, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailEl.value)) {
        showFieldError(emailEl, 'Please enter a valid email address (e.g. name@domain.com).');
        isValid = false;
      } else {
        markFieldValid(emailEl);
      }

      // Validate Phone (optional — only validate if filled)
      var phoneEl = form.querySelector('input[name="phone"]');
      if (phoneEl && phoneEl.value.trim().length > 0) {
        if (!validatePhone(phoneEl.value)) {
          showFieldError(phoneEl, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
          isValid = false;
        } else {
          markFieldValid(phoneEl);
        }
      } else if (phoneEl) {
        clearFieldError(phoneEl);
      }

      // Validate Subject
      var subjectEl = form.querySelector('select[name="subject"]');
      if (!subjectEl || !subjectEl.value) {
        showFieldError(subjectEl, 'Please select a subject.');
        isValid = false;
      } else {
        markFieldValid(subjectEl);
      }

      // Validate Message
      var msgEl = form.querySelector('textarea[name="message"]');
      if (!msgEl || !validateNotEmpty(msgEl.value)) {
        showFieldError(msgEl, 'Please tell us about your requirements.');
        isValid = false;
      } else {
        markFieldValid(msgEl);
      }

      if (!isValid) {
        focusFirstError(form);
        return;
      }

      // ---- All valid — submit ----
      form.dataset.submitting = 'true';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.dataset.loadingLabel = 'Sending…';
        setBtnLoading(btn);
      }

      var payload = {
        type:    'contact',
        name:    nameEl    ? nameEl.value.trim()    : '',
        email:   emailEl   ? emailEl.value.trim()   : '',
        phone:   phoneEl   ? phoneEl.value.trim()   : '',
        subject: subjectEl ? subjectEl.value        : '',
        message: msgEl     ? msgEl.value.trim()     : ''
      };

      var timeoutId = setTimeout(function() {
        form.dataset.submitting = 'false';
        if (btn) resetBtn(btn);
        showModal(overlay, errorModal);
      }, 15000);

      fetch(CONTACT_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
      .then(function() {
        clearTimeout(timeoutId);
        showModal(overlay, successModal);
        form.reset();
        form.querySelectorAll('.has-success, .has-error').forEach(function(el) {
          el.classList.remove('has-success', 'has-error');
        });
        form.querySelectorAll('.field-error-msg').forEach(function(el) { el.remove(); });
      })
      .catch(function(err) {
        clearTimeout(timeoutId);
        console.error('Contact submission error:', err);
        showModal(overlay, errorModal);
      })
      .finally(function() {
        form.dataset.submitting = 'false';
        if (btn) resetBtn(btn);
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
    setupContactSubmission();
  });
}());
