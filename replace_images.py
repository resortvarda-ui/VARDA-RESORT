import os
import re

replacements = {
    'hero-resort': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920',
    'room-deluxe': 'https://images.unsplash.com/photo-1582719478250-c89d14c10122?auto=format&fit=crop&q=80&w=1920',
    'room-suite': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1920',
    'restaurant-main': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920',
    'wedding-main': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920',
    'banquet-main': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1920',
    'pool-spa': 'https://images.unsplash.com/photo-1542314831-c6a4d14d837e?auto=format&fit=crop&q=80&w=1920',
    'contact_final_bg': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1920',
    'v2': 'https://images.unsplash.com/photo-1551882547-ff40c0d129df?auto=format&fit=crop&q=80&w=1920',
    'v3': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1920',
    'v4': 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1920'
}

for root, _, files in os.walk(r'c:\Users\Viraj rai\Projects\varda-resort'):
    if '_site' in root or '.git' in root or 'vendor' in root:
        continue
    for f in files:
        if f.endswith('.html') or f.endswith('.md'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            for key, url in replacements.items():
                # Replace frontmatter
                new_content = re.sub(fr'\"/assets/images/{key}\.(webp|jpg|png)\"', f'\"{url}\"', new_content)
                new_content = re.sub(fr'\'/assets/images/{key}\.(webp|jpg|png)\'', f'\"{url}\"', new_content)
                # Replace jekyll tags
                new_content = re.sub(fr'{{{{\s*\'/assets/images/{key}\.(webp|jpg|png)\'\s*\|\s*relative_url\s*}}}}', url, new_content)
                new_content = re.sub(fr'{{{{\s*\"/assets/images/{key}\.(webp|jpg|png)\"\s*\|\s*relative_url\s*}}}}', url, new_content)
                # Replace direct occurrences if any
                new_content = re.sub(fr'/assets/images/{key}\.(webp|jpg|png)', url, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Updated {filepath}')
print('Done!')
