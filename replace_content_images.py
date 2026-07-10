import os
import re

base_dir = r"c:\Users\Viraj rai\Projects\varda-resort"

# 1. Update restaurant.html
rest_path = os.path.join(base_dir, "restaurant.html")
with open(rest_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Private Dining image with restaurant-main.jpg
content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1533759413974[^"]+" alt="Private dining at Varda Resort"',
    r'src="{{ \'/assets/images/restaurant-main.jpg\' | relative_url }}" alt="Private dining at Varda Resort"',
    content
)
with open(rest_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update offers.html
offers_path = os.path.join(base_dir, "offers.html")
with open(offers_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1582719478250[^"]+"',
    r'src="{{ \'/assets/images/room-suite.jpg\' | relative_url }}"',
    content
)
content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1631049307264[^"]+"',
    r'src="{{ \'/assets/images/pool-spa.jpg\' | relative_url }}"',
    content
)
with open(offers_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update blog.html
blog_path = os.path.join(base_dir, "blog.html")
with open(blog_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1566073771259[^"]+"',
    r'src="{{ \'/assets/images/gallery-left.jpg\' | relative_url }}"',
    content
)
content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1517248135467[^"]+"',
    r'src="{{ \'/assets/images/gallery-top-right.jpg\' | relative_url }}"',
    content
)
content = re.sub(
    r'src="https://images\.unsplash\.com/photo-1540555700478[^"]+"',
    r'src="{{ \'/assets/images/banquet-main.jpg\' | relative_url }}"',
    content
)
with open(blog_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated content images")
