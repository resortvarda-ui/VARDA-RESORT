import os
import re

files = [
    "about.html", "banquets.html", "blog.html", "index.html",
    "restaurant.html", "rooms.html", "weddings.html"
]

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

def add_dimensions(match):
    img_tag = match.group(0)
    if 'width=' not in img_tag and 'height=' not in img_tag:
        # insert before the closing >
        return img_tag[:-1] + ' width="800" height="600">'
    return img_tag

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # find all <img> tags and add dimensions if missing
    new_content = re.sub(r'<img\s+[^>]+>', add_dimensions, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added dimensions to {filename}")
    else:
        print(f"Skipped {filename} (No changes needed)")
