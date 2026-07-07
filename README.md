# Varda Resort — Jekyll Website

A responsive luxury resort website for **Varda Resort & Restaurant**, Buxar, Bihar.

## Project Structure

```
varda-resort/
├── _config.yml          # Site configuration
├── _data/               # YAML data files (navigation, slides, features)
├── _includes/           # Reusable HTML partials
├── _layouts/            # Page layouts
├── assets/
│   ├── css/main.css     # Stylesheet
│   └── js/main.js       # Client-side interactions
├── index.html           # Homepage
├── Gemfile              # Ruby dependencies
└── README.md
```

## Prerequisites

- [Ruby](https://rubyinstaller.org/) 3.x (Windows: Ruby+Devkit)
- Bundler gem

## Setup

```powershell
cd "C:\Users\Viraj rai\Projects\varda-resort"
gem install bundler
bundle install
```

## Run Locally

```powershell
bundle exec jekyll serve
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

## Build for Production

```powershell
bundle exec jekyll build
```

Output is generated in the `_site/` folder.

## Customization

- Edit `_config.yml` for site title, contact info, and metadata
- Edit `_data/navigation.yml` to change menu links
- Edit `_data/hero_slides.yml` for carousel content
- Edit `_data/features.yml` for feature cards
