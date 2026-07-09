import os
import glob

def fix_css():
    css_files = glob.glob('assets/css/**/*.css', recursive=True)
    for file in css_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace('100vw', '100%')
        
        if file.endswith('main.css'):
            if 'html {' in new_content and 'overflow-x: hidden;' not in new_content.split('html {')[1].split('}')[0]:
                new_content = new_content.replace('html {\n  scroll-behavior: smooth;\n  background: var(--bg-primary);\n  font-size: 16px;\n  -webkit-text-size-adjust: 100%;\n  overscroll-behavior: none;\n}', 'html {\n  scroll-behavior: smooth;\n  background: var(--bg-primary);\n  font-size: 16px;\n  -webkit-text-size-adjust: 100%;\n  overscroll-behavior: none;\n  overflow-x: hidden;\n}')
        
        if content != new_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")

if __name__ == '__main__':
    fix_css()
