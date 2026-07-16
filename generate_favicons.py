import os
from PIL import Image, ImageDraw, ImageChops

def create_logo(size=512, bg_color=None):
    scale = 8
    canvas_size = 512 * scale
    
    if bg_color:
        img = Image.new('RGBA', (canvas_size, canvas_size), bg_color)
    else:
        img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
        
    right_img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    right_draw = ImageDraw.Draw(right_img)
    right_poly = [(473.7, 40.7), (440.7, 18.3), (133.3, 471.3), (166.3, 493.7)]
    right_poly = [(x*scale, y*scale) for x, y in right_poly]
    right_draw.polygon(right_poly, fill=(212, 175, 55, 255))
    
    eraser = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 255))
    eraser_draw = ImageDraw.Draw(eraser)
    mask_poly = [(81.9, -37.3), (-17.3, 30.1), (335.1, 549.3), (434.3, 481.9)]
    mask_poly = [(x*scale, y*scale) for x, y in mask_poly]
    eraser_draw.polygon(mask_poly, fill=(255, 255, 255, 0))
    
    right_img = ImageChops.multiply(right_img, eraser)
    
    left_img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    left_draw = ImageDraw.Draw(left_img)
    left_poly = [(71.3, 18.3), (38.3, 40.7), (345.7, 493.7), (378.7, 471.3)]
    left_poly = [(x*scale, y*scale) for x, y in left_poly]
    left_draw.polygon(left_poly, fill=(212, 175, 55, 255))
    
    final_img = Image.alpha_composite(img, right_img)
    final_img = Image.alpha_composite(final_img, left_img)
    
    return final_img.resize((size, size), Image.Resampling.LANCZOS)

def main():
    dest_dir = r"c:\Users\Viraj rai\Projects\varda-resort"
    
    # 1. Favicon.ico (contains 16, 32, 48)
    ico_img = create_logo(256, None)
    ico_img.save(os.path.join(dest_dir, "favicon.ico"), format="ICO", sizes=[(16,16), (32,32), (48,48), (64,64)])
    
    # 2. PNGs
    create_logo(16, None).save(os.path.join(dest_dir, "favicon-16x16.png"))
    create_logo(32, None).save(os.path.join(dest_dir, "favicon-32x32.png"))
    create_logo(192, None).save(os.path.join(dest_dir, "android-chrome-192x192.png"))
    create_logo(512, None).save(os.path.join(dest_dir, "android-chrome-512x512.png"))
    
    # Apple touch icon (solid background)
    create_logo(180, (16, 16, 16, 255)).convert("RGB").save(os.path.join(dest_dir, "apple-touch-icon.png"))
    
    print("Favicons generated successfully!")

if __name__ == "__main__":
    main()
