/* preloader.js */

// Script execution starts as early as possible
document.addEventListener("DOMContentLoaded", () => {
  // Add loading class to body immediately to prevent scrolling
  document.body.classList.add('varda-loading');

  // Initialize background particles for the cinematic effect
  createVardaParticles();

  // Listen for the fully loaded window event (all images, scripts, CSS, and fonts)
  window.addEventListener('load', () => {
    const preloader = document.getElementById('varda-preloader');
    if (!preloader) return;

    // Minimum display time (in milliseconds) for the preloader 
    // to ensure the full animation sequence plays elegantly.
    const minLoadingTime = 2800; 
    const timeElapsed = performance.now();
    const delay = Math.max(0, minLoadingTime - timeElapsed);

    setTimeout(() => {
      // Trigger the elegant fade-out transition
      preloader.classList.add('fade-out');

      // Wait for the CSS fade-out transition to complete (1000ms) before DOM removal
      setTimeout(() => {
        preloader.remove();
        
        // Restore page scrolling functionality
        document.body.classList.remove('varda-loading');
        
        // Optionally trigger a smooth fade-in for the main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.classList.add('varda-content-reveal');
        }
      }, 1000);

    }, delay);
  });
});

/**
 * Creates subtle floating particles in the background
 * Uses requestAnimationFrame principles within CSS animations for performance
 */
function createVardaParticles() {
  const container = document.getElementById('varda-preloader-particles');
  if (!container) return;
  
  // Responsive particle density
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 15 : 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('varda-particle');
    
    // Randomized sizing and positioning
    const size = Math.random() * 3 + 1; // Ranging from 1px to 4px
    const startPosX = Math.random() * 100; // 0% to 100% viewport width
    const duration = Math.random() * 10 + 12; // 12s to 22s travel time
    const delay = Math.random() * 5; // Stagger start times

    // Apply inline styles for each unique particle
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startPosX}%`;
    particle.style.bottom = `-10%`; // Spawn just outside bottom edge
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
}
