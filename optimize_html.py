import os
import re

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    img_tags = re.findall(r'<img[^>]+>', new_content)
    for tag in img_tags:
        new_tag = tag
        
        # 1. Update unsplash URLs to avif
        if 'images.unsplash.com' in new_tag:
            if 'fm=' in new_tag:
                new_tag = re.sub(r'fm=[^&\"\']+', 'fm=avif', new_tag)
            else:
                new_tag = new_tag.replace('?', '?fm=avif&')
            
            src_match = re.search(r'src=["\']([^"\']+)["\']', new_tag)
            if src_match and 'srcset=' not in new_tag:
                src_url = src_match.group(1)
                src_480 = re.sub(r'w=\d+', 'w=480', src_url)
                src_800 = re.sub(r'w=\d+', 'w=800', src_url)
                src_1200 = re.sub(r'w=\d+', 'w=1200', src_url)
                src_1920 = re.sub(r'w=\d+', 'w=1920', src_url)
                srcset = f'{src_480} 480w, {src_800} 800w, {src_1200} 1200w, {src_1920} 1920w'
                # Check if tag ends with /> or >
                if new_tag.endswith('/>'):
                    new_tag = new_tag[:-2] + f' srcset="{srcset}" sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, (max-width: 1200px) 1200px, 100vw" />'
                else:
                    new_tag = new_tag[:-1] + f' srcset="{srcset}" sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, (max-width: 1200px) 1200px, 100vw">'

        # 2. Add lazy loading if appropriate
        if 'fetchpriority="high"' not in new_tag and 'hero-img' not in new_tag and 'loading="lazy"' not in new_tag:
            new_tag = new_tag.replace('<img ', '<img loading="lazy" ')

        if new_tag != tag:
            new_content = new_content.replace(tag, new_tag)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Optimized images in {filepath}")

for root, _, files in os.walk(r'c:\Users\Viraj rai\Projects\varda-resort'):
    if '_site' in root or '.git' in root or 'vendor' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            process_html_file(os.path.join(root, f))

print("Optimization complete!")
