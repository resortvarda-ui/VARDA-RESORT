import os
import re

files = [
    "about.html", "banquets.html", "blog.html", "booking.html", "contact.html",
    "gallery.html", "index.html", "offers.html", "packages.html", "restaurant.html",
    "rooms.html", "weddings.html"
]

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    hero_match = re.search(r"background-image:\s*url\('\{\{\s*'(/assets/images/[^']+)'", content)
    hero_image = hero_match.group(1) if hero_match else ""
    
    parts = content.split('---', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        new_fm = frontmatter
        
        if 'description:' not in new_fm:
            title_match = re.search(r'title:\s*["\']([^"\']+)["\']', new_fm)
            title = title_match.group(1) if title_match else "Varda Resort"
            new_fm = new_fm.rstrip() + f'\ndescription: "Explore {title} at Varda Resort, Buxar. Experience our premium services and luxury hospitality."\n'
        
        if 'hero_image:' not in new_fm and hero_image:
            new_fm = new_fm.rstrip() + f'\nhero_image: {hero_image}\n'
            
        if new_fm != frontmatter:
            parts[1] = new_fm
            new_content = '---'.join(parts)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} (No changes needed)")
