import os
import glob

extra_css = """
/* ==========================================================================
   GLOBAL MOBILE FIXES (Appended by Audit)
   ========================================================================== */
@media (max-width: 768px) {
    /* Ensure elements don't touch screen edges */
    .container, .footer-container, .center-heading-block, .dishes-grid, .welcome-split, 
    .chef-special-box, .why-dine-grid, .gallery-pinterest-grid, .form-grid, .rooms-catalogue,
    .featured-suite-box, .features-matrix, .gallery-mosaic, .proposition-grid, 
    .space-layout-row, .luxury-matrix-grid, .stats-editorial-flex, .glass-form-grid,
    .weddings-catalogue, .timeline-content, .contact-content-grid, .location-details, .form-container,
    .booking-dialog, .lightbox-box, .hero-content, .split-content, .accordion-header, .accordion-content {
        padding-left: 20px !important;
        padding-right: 20px !important;
        box-sizing: border-box;
    }
    
    .room-card-footer, .dish-action, .cta-actions-row, .suite-content-interior, .chef-content-interior, .glass-reservation-card {
        padding-left: 20px !important;
        padding-right: 20px !important;
        box-sizing: border-box;
    }
    
    img, video, iframe {
        max-width: 100% !important;
        height: auto;
    }
    
    /* Make all inputs full width */
    input, select, textarea, button.cta-gold-btn, button.submit-btn, .btn-gold, .btn-outline {
        width: 100% !important;
    }

    /* Force grids to single column on small screens to prevent breakage */
    .welcome-split, .dishes-grid, .chef-special-box, .why-dine-grid, .gallery-pinterest-grid, 
    .rooms-catalogue, .featured-suite-box, .gallery-mosaic, .proposition-grid,
    .luxury-matrix-grid, .stats-editorial-flex, .glass-form-grid {
        grid-template-columns: 1fr !important;
    }

    /* Ensure text wraps nicely */
    p, h1, h2, h3, h4, h5, h6 {
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
}
"""

css_dir = 'c:/Users/Viraj rai/Projects/varda-resort/assets/css/pages/'
css_files = glob.glob(os.path.join(css_dir, '*.css'))

for css_file in css_files:
    with open(css_file, 'a', encoding='utf-8') as f:
        f.write(extra_css)
    print(f"Updated: {os.path.basename(css_file)}")
