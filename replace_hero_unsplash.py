import os
import re

updates = {
    'about.html': 'https://images.unsplash.com/photo-1542314831-c6a4d14d837e?auto=format&fit=crop&q=80&w=1920',
    'amenities.html': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920',
    'blog.html': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920',
    'booking.html': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920',
    'contact.html': "{{ '/assets/images/contact_final_bg.jpg' | relative_url }}",
    'gallery.html': "{{ '/assets/images/hero-resort.jpg' | relative_url }}",
    'offers.html': 'https://images.unsplash.com/photo-1582719478250-c89d14c10122?auto=format&fit=crop&q=80&w=1920',
    'packages.html': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1920',
    '404.html': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1920',
    'privacy-policy.html': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1920',
    'terms.html': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1920'
}

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

for filename, bg_url in updates.items():
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We need to replace url('...') with the new URL
        if bg_url.startswith('{{'):
            new_url_string = f"url('{bg_url}')"
        else:
            new_url_string = f"url('{bg_url}')"
        
        # The previous script changed them to url('{{ '/assets/images/hero-*.jpg' | relative_url }}')
        content = re.sub(r"url\('\{\{\s*'/assets/images/hero-[^']+'\s*\|\s*relative_url\s*\}\}'\)", new_url_string, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
