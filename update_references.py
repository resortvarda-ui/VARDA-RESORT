import os
import json

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

# Load mappings
with open(os.path.join(base_dir, "image_mappings.json"), "r") as f:
    mappings = json.load(f)

# Find all HTML and CSS files
target_exts = {".html", ".css", ".md"}
files_to_check = []

for root, _, files in os.walk(base_dir):
    if "_site" in root or ".gemini" in root or ".git" in root:
        continue
    for file in files:
        if os.path.splitext(file)[1] in target_exts:
            files_to_check.append(os.path.join(root, file))

# Replace mappings
for filepath in files_to_check:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        # Basic string replacement because the filenames are unique enough
        for old_img, new_img in mappings.items():
            # URL encoded spaces
            old_img_encoded = old_img.replace(" ", "%20")
            new_img_encoded = new_img.replace(" ", "%20")
            
            new_content = new_content.replace(old_img, new_img)
            new_content = new_content.replace(old_img_encoded, new_img_encoded)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated references in {os.path.basename(filepath)}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
