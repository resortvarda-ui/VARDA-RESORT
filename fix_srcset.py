import os
import re

def fix_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    img_tags = re.findall(r'<img[^>]+>', new_content)
    for tag in img_tags:
        new_tag = tag
        
        # If it's an unsplash image with srcset containing '{{' or just messed up
        if 'images.unsplash.com' in tag:
            # Extract raw url
            # It might look like src="{{ "https://..." | relative_url }}"
            # Or src="https://..."
            url_match = re.search(r'images\.unsplash\.com/[^"\']+', tag)
            if url_match:
                raw_url = 'https://' + url_match.group(0)
                
                # Clean up query params to just what we want
                base_url = re.sub(r'\?.*$', '', raw_url)
                
                src_480 = f"{base_url}?fm=avif&auto=format&fit=crop&q=80&w=480"
                src_800 = f"{base_url}?fm=avif&auto=format&fit=crop&q=80&w=800"
                src_1200 = f"{base_url}?fm=avif&auto=format&fit=crop&q=80&w=1200"
                src_1920 = f"{base_url}?fm=avif&auto=format&fit=crop&q=80&w=1920"
                
                srcset = f'{src_480} 480w, {src_800} 800w, {src_1200} 1200w, {src_1920} 1920w'
                sizes = "(max-width: 600px) 480px, (max-width: 900px) 800px, (max-width: 1200px) 1200px, 100vw"
                
                # Reconstruct the tag properly
                # Keep alt, class, fetchpriority, loading
                alt_match = re.search(r'alt=["\']([^"\']*)["\']', tag)
                alt = alt_match.group(1) if alt_match else "Image"
                
                class_match = re.search(r'class=["\']([^"\']*)["\']', tag)
                cls = class_match.group(1) if class_match else ""
                
                fp_match = re.search(r'fetchpriority=["\']([^"\']*)["\']', tag)
                fp = f'fetchpriority="{fp_match.group(1)}"' if fp_match else ""
                
                lazy = 'loading="lazy"' if 'loading="lazy"' in tag else ""
                
                # Combine properties
                props = []
                if cls: props.append(f'class="{cls}"')
                if alt: props.append(f'alt="{alt}"')
                if fp: props.append(fp)
                if lazy: props.append(lazy)
                
                props_str = " ".join([p for p in props if p])
                
                # Reconstruct tag
                if tag.endswith('/>'):
                    new_tag = f'<img src="{src_1920}" srcset="{srcset}" sizes="{sizes}" {props_str} />'
                else:
                    new_tag = f'<img src="{src_1920}" srcset="{srcset}" sizes="{sizes}" {props_str}>'
                
                new_content = new_content.replace(tag, new_tag)

    # Also fix <source srcset="{{ "https://... | relative_url }}" ...>
    source_tags = re.findall(r'<source[^>]+>', new_content)
    for tag in source_tags:
        if 'images.unsplash.com' in tag and '{{' in tag:
            url_match = re.search(r'images\.unsplash\.com/[^"\']+', tag)
            if url_match:
                # the previous url_match will include everything until the first quote
                # wait, url_match.group(0) might include | relative_url if there's no quote
                raw = url_match.group(0).split(' ')[0].split('"')[0].split("'")[0]
                base_url = re.sub(r'\?.*$', '', 'https://' + raw)
                src = f"{base_url}?fm=avif&auto=format&fit=crop&q=80&w=1920"
                
                type_match = re.search(r'type=["\']([^"\']*)["\']', tag)
                typ = f'type="{type_match.group(1)}"' if type_match else ""
                
                new_tag = f'<source srcset="{src}" {typ}>'
                new_content = new_content.replace(tag, new_tag)


    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk(r'c:\Users\Viraj rai\Projects\varda-resort'):
    if '_site' in root or '.git' in root or 'vendor' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            fix_html_file(os.path.join(root, f))
print("Done fixing!")
