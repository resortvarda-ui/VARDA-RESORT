import os
import re

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"
html_files = [f for f in os.listdir(base_dir) if f.endswith('.html')]

for file in html_files:
    filepath = os.path.join(base_dir, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.finditer(r'<img[^>]+src="([^"]+)"[^>]*>', content)
    for m in matches:
        src = m.group(1)
        if 'unsplash.com' in src:
            print(f"[{file}] {src}")
