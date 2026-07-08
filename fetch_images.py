import urllib.request
import os

IMAGE_DIR = 'assets/images/'

images_to_download = {
    'room-suite.jpg': 'https://images.unsplash.com/photo-1566665797739-1674de7a6f26?q=80&w=1080&auto=format&fit=crop',
    'restaurant-main.jpg': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1920&auto=format&fit=crop',
    'pool-spa.jpg': 'https://images.unsplash.com/photo-1582610116311-5361b11e2f7b?q=80&w=1080&auto=format&fit=crop'
}

for filename, url in images_to_download.items():
    path = os.path.join(IMAGE_DIR, filename)
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
