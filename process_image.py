import os
from PIL import Image, ImageEnhance

src_path = r"C:\Users\Viraj rai\.gemini\antigravity\brain\9beb5cd7-12a4-48b6-95aa-1f34bbd6060c\varda_resort_luxury_hero_1783658894318.jpg"
dest_dir = r"c:\Users\Viraj rai\Projects\varda-resort\assets\images"
os.makedirs(dest_dir, exist_ok=True)

img = Image.open(src_path)
# Ensure image is in RGB mode for saving as JPEG/WebP
if img.mode != 'RGB':
    img = img.convert('RGB')

# Enhance brightness and contrast
img = ImageEnhance.Brightness(img).enhance(1.15)
img = ImageEnhance.Contrast(img).enhance(1.10)

# Save original size WebP
img.save(os.path.join(dest_dir, "hero-varda-resort-1920w.webp"), "WEBP", quality=80)
# Save original size JPG as fallback
img.save(os.path.join(dest_dir, "hero-varda-resort-1920w.jpg"), "JPEG", quality=80)

# Generate perfectly framed mobile crop (3:4 aspect ratio)
mobile_ratio = 3 / 4
mobile_height = img.height
mobile_width = int(mobile_height * mobile_ratio)
left = (img.width - mobile_width) / 2
top = 0
right = (img.width + mobile_width) / 2
bottom = mobile_height
mobile_crop = img.crop((left, top, right, bottom))
mobile_crop.save(os.path.join(dest_dir, "hero-varda-resort-mobile.webp"), "WEBP", quality=80)
mobile_crop.save(os.path.join(dest_dir, "hero-varda-resort-mobile.jpg"), "JPEG", quality=80)

# Generate other sizes
sizes = {
    "1200w": 1200,
    "800w": 800,
    "480w": 480
}

for name, width in sizes.items():
    ratio = width / img.width
    height = int(img.height * ratio)
    resized = img.resize((width, height), Image.Resampling.LANCZOS)
    resized.save(os.path.join(dest_dir, f"hero-varda-resort-{name}.webp"), "WEBP", quality=80)
    resized.save(os.path.join(dest_dir, f"hero-varda-resort-{name}.jpg"), "JPEG", quality=80)

print("Images generated successfully.")
