import os
import re

updates = {
    'about.html': 'hero-about.jpg',
    'amenities.html': 'hero-amenities.jpg',
    'blog.html': 'hero-blog.jpg',
    'booking.html': 'hero-booking.jpg',
    'contact.html': 'hero-contact.jpg',
    'gallery.html': 'hero-gallery.jpg',
    'offers.html': 'hero-offers.jpg',
    'packages.html': 'hero-packages.jpg',
    '404.html': 'hero-utility.jpg',
    'privacy-policy.html': 'hero-utility.jpg',
    'terms.html': 'hero-utility.jpg'
}

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

for filename, img_name in updates.items():
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace background-image URL
        # e.g. style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920');"
        # with style="background-image: url('{{ '/assets/images/hero-about.jpg' | relative_url }}');"
        
        new_url = f"{{{{ '/assets/images/{img_name}' | relative_url }}}}"
        # Matches url('https://images.unsplash.com...') or url('...')
        content = re.sub(r"url\('https://images\.unsplash\.com[^']+'\)", f"url('{new_url}')", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
