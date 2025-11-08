# App Assets

This directory contains the required assets for the QuitBet AI mobile app.

## Required Assets

### iOS Assets

1. **icon.png** (1024x1024px)
   - Format: PNG
   - No transparency
   - Square format
   - No rounded corners (Apple adds them)
   - File size: under 500KB
   - Professional gambling recovery theme (green healing colors)

2. **splash.png** (2732x2732px recommended)
   - Format: PNG
   - Should match the app's dark theme (#111827 background)
   - Contains the app logo/name centered

### Android Assets

1. **adaptive-icon.png** (1024x1024px)
   - Format: PNG
   - Foreground image for adaptive icon
   - Should be centered within safe zone (inner 66% of image)
   - Background color: #111827 (configured in app.json)

### Web Assets

1. **favicon.png** (48x48px or 512x512px)
   - Format: PNG or ICO
   - App icon for web browser

## Creating Assets

### Option 1: Design Tools
- Use Canva, Figma, or Adobe Photoshop
- Create designs with the app's color scheme:
  - Primary: #60a5fa (light blue)
  - Secondary: #34d399 (green)
  - Background: #111827 (dark gray)
  - Text: #f9fafb (light)

### Option 2: Online Generators
- Use online icon generators like:
  - https://www.appicon.co/
  - https://icon.kitchen/
  - https://www.favicon-generator.org/

### Option 3: AI Generators
- Use DALL-E, Midjourney, or similar
- Prompt: "App icon for gambling recovery app, green healing colors, dark theme, professional, minimalist"

## Quick Setup

If you need placeholder assets for testing:

```bash
# Create a simple placeholder icon (requires ImageMagick)
convert -size 1024x1024 xc:#111827 -gravity center -pointsize 200 -fill "#60a5fa" -annotate +0+0 "QB" apps/mobile/assets/icon.png
```

## Notes

- All assets should follow the app's dark theme
- Icons should be recognizable at small sizes
- Splash screen should load quickly
- Consider accessibility (contrast ratios)

