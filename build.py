import os
import glob
import minify_html
from csscompressor import compress as compress_css
from jsmin import jsmin
from PIL import Image

SITE_DIR = '_site'

def optimize_images():
    print("Optimizing images...")
    image_files = glob.glob(f'{SITE_DIR}/**/*.jpg', recursive=True) + \
                  glob.glob(f'{SITE_DIR}/**/*.png', recursive=True) + \
                  glob.glob(f'{SITE_DIR}/**/*.jpeg', recursive=True)
    
    for img_path in image_files:
        try:
            with Image.open(img_path) as img:
                # Convert to WebP
                webp_path = os.path.splitext(img_path)[0] + '.webp'
                img.save(webp_path, 'WEBP', quality=80)
                print(f"Optimized: {img_path} -> {webp_path}")
        except Exception as e:
            print(f"Error optimizing {img_path}: {e}")

def optimize_css():
    print("Minifying CSS...")
    css_files = glob.glob(f'{SITE_DIR}/**/*.css', recursive=True)
    for css_file in css_files:
        with open(css_file, 'r', encoding='utf-8') as f:
            css_content = f.read()
        minified = compress_css(css_content)
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        print(f"Minified CSS: {css_file}")

def optimize_js():
    print("Minifying JS...")
    js_files = glob.glob(f'{SITE_DIR}/**/*.js', recursive=True)
    for js_file in js_files:
        if '.min.' in js_file: continue
        with open(js_file, 'r', encoding='utf-8') as f:
            js_content = f.read()
        minified = jsmin(js_content)
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        print(f"Minified JS: {js_file}")

def optimize_html():
    print("Minifying HTML...")
    html_files = glob.glob(f'{SITE_DIR}/**/*.html', recursive=True)
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        minified = minify_html.minify(
            html_content, 
            minify_js=True, 
            minify_css=True, 
            remove_processing_instructions=True,
            keep_closing_tags=True
        )
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        print(f"Minified HTML: {html_file}")

if __name__ == "__main__":
    if not os.path.exists(SITE_DIR):
        print("Site directory not found!")
    else:
        optimize_css()
        optimize_js()
        optimize_images()
        optimize_html()
        print("Build optimization complete!")
