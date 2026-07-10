import os
import re

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

updates = {
    '404.html': "url('{{ '/assets/images/gallery-bottom-right.jpg' | relative_url }}'); filter: grayscale(50%);",
    'amenities.html': "url('{{ '/assets/images/pool-spa.jpg' | relative_url }}');",
    'blog.html': "url('{{ '/assets/images/gallery-top-right.jpg' | relative_url }}');",
    'booking.html': "url('{{ '/assets/images/gallery-left.jpg' | relative_url }}');",
    'offers.html': "url('{{ '/assets/images/Deluxe%20Sanctum%20Room.jpg' | relative_url }}');",
    'packages.html': "url('{{ '/assets/images/room-suite.jpg' | relative_url }}');",
    'privacy-policy.html': "url('{{ '/assets/images/gallery-bottom-right.jpg' | relative_url }}'); filter: grayscale(30%);",
    'terms.html': "url('{{ '/assets/images/gallery-bottom-right.jpg' | relative_url }}'); filter: grayscale(30%);",
}

for filename, style_val in updates.items():
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace background-image style completely
        content = re.sub(
            r"style=\"background-image:\s*url\('https://images\.unsplash\.com[^']+'\);[^>]*\"",
            f'style="background-image: {style_val}"',
            content
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# Update restaurant.html chef image
rest_path = os.path.join(base_dir, 'restaurant.html')
if os.path.exists(rest_path):
    with open(rest_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(
        r'src="https://images\.unsplash\.com/photo-1520250497591[^"]+"',
        r'src="{{ \'/assets/images/v2.jpg\' | relative_url }}"',
        content
    )
    with open(rest_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("All remaining Unsplash images replaced with local assets.")
