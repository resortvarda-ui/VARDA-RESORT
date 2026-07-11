import os
import glob
from PIL import Image
import json

img_dir = r"c:\Users\Viraj rai\Projects\varda-resort\assets\images"
MAX_WIDTH = 1920
SIZE_THRESHOLD = 300 * 1024 # 300 KB

mappings = {}

for ext in ('*.jpg', '*.jpeg', '*.png'):
    for filepath in glob.glob(os.path.join(img_dir, ext)):
        size = os.path.getsize(filepath)
        if size > SIZE_THRESHOLD:
            filename = os.path.basename(filepath)
            name, _ = os.path.splitext(filename)
            webp_name = name + ".webp"
            webp_path = os.path.join(img_dir, webp_name)
            
            try:
                with Image.open(filepath) as img:
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Resize if needed
                    width, height = img.size
                    if width > MAX_WIDTH:
                        ratio = MAX_WIDTH / width
                        new_height = int(height * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                        
                    # Save as webp
                    img.save(webp_path, "webp", quality=82, method=6)
                    
                    old_size_mb = size / (1024*1024)
                    new_size_mb = os.path.getsize(webp_path) / (1024*1024)
                    print(f"Optimized: {filename} ({old_size_mb:.2f} MB) -> {webp_name} ({new_size_mb:.2f} MB)")
                    
                    mappings[filename] = webp_name
            except Exception as e:
                print(f"Error processing {filename}: {e}")

# Save mappings for the next script
with open(r"c:\Users\Viraj rai\Projects\varda-resort\image_mappings.json", "w") as f:
    json.dump(mappings, f)
