/* assets/js/preloader.js */
(function() {
  // 1. Determine if we should show the preloader
  let shouldShowPreloader = true;
  let instantFadeOut = false;
  
  if (sessionStorage.getItem('varda_instant_fadeout') === 'true') {
    shouldShowPreloader = true;
    instantFadeOut = true;
    sessionStorage.removeItem('varda_instant_fadeout');
  } else if (window.performance) {
    let navType = '';
    
    // Modern Performance Navigation Timing API
    if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
      navType = performance.getEntriesByType('navigation')[0].type;
    } 
    // Fallback for older browsers
    else if (performance.navigation) {
      const type = performance.navigation.type;
      if (type === 1) navType = 'reload';
      else if (type === 0) navType = 'navigate';
      else if (type === 2) navType = 'back_forward';
    }

    if (navType === 'reload') {
      // Requirement: Show preloader when the user refreshes (F5 or Ctrl+R)
      shouldShowPreloader = true;
    } else {
      // Requirement: Check sessionStorage to track if visitor has seen it this session
      // This applies to 'navigate' (internal links) and 'back_forward'
      if (sessionStorage.getItem('varda_preloader_seen') === 'true') {
        shouldShowPreloader = false;
      } else {
        // Requirement: Show preloader when user opens website for the first time
        shouldShowPreloader = true;
      }
    }
  }

  // 2. Bypass Logic for Internal Navigation
  if (!shouldShowPreloader) {
    // Requirement: Remove or bypass the preloader immediately without animation
    const preloader = document.getElementById('varda-preloader');
    if (preloader && preloader.parentNode) {
      // Instantly remove from DOM so it never flashes
      preloader.parentNode.removeChild(preloader);
    }
    
    // Ensure scrolling is never locked
    document.documentElement.classList.remove('varda-loading');
    if (document.body) document.body.classList.remove('varda-loading');
    
    // Make sure main content is instantly visible without waiting for fade-in animations
    const mainContent = document.getElementById('content') || document.querySelector('main');
    if (mainContent) {
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'none';
    }
    
    // Exit the script early so no animations or load events are registered
    return;
  }

  // 3. Normal Preloader Execution (If shouldShowPreloader === true)
  
  // Mark as seen for future internal navigations
  sessionStorage.setItem('varda_preloader_seen', 'true');

  // Execute immediately to prevent scroll and flash
  document.documentElement.classList.add('varda-loading');
  if (document.body) document.body.classList.add('varda-loading');

  function createVardaParticles() {
    const container = document.getElementById('varda-preloader-particles');
    if (!container) return;
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 35;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('varda-particle');
      
      const size = Math.random() * 3 + 1;
      const startPosX = Math.random() * 100;
      const duration = Math.random() * 10 + 12;
      const delay = Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${startPosX}%`;
      particle.style.bottom = `-10%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }
  }

  // Ensure DOM is ready before injecting particles
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createVardaParticles);
  } else {
    createVardaParticles();
  }

  // Safe merging with existing window.onload using event listeners
  window.addEventListener('load', function() {
    const preloader = document.getElementById('varda-preloader');
    if (!preloader) return;

    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html' || path === '';

    const minLoadingTime = instantFadeOut ? 0 : 2500;
    setTimeout(function() {
      if (!isHome && !instantFadeOut) {
        sessionStorage.setItem('varda_instant_fadeout', 'true');
        window.location.replace('/');
        return;
      }

      preloader.classList.add('fade-out');

      setTimeout(function() {
        if(preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
        document.documentElement.classList.remove('varda-loading');
        document.body.classList.remove('varda-loading');
        
        const mainContent = document.getElementById('content') || document.querySelector('main');
        if (mainContent) {
          mainContent.classList.add('varda-content-reveal');
        }
      }, 1000);

    }, minLoadingTime);
  });
})();
