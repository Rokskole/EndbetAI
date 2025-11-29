# App Store Promotional Image Guide

## Requirements

Your promotional image must meet the following requirements:
- **Format**: JPG or PNG
- **Dimensions**: 1024 x 1024 pixels (square)
- **Resolution**: 72 dpi
- **Color Mode**: RGB
- **Flattened**: No layers (single layer)
- **No rounded corners**: Square edges (Apple will add rounded corners if needed)

---

## Method 1: Using Photoshop (Recommended)

### Step-by-Step:

1. **Create New Document**
   - File → New
   - Width: `1024` pixels
   - Height: `1024` pixels
   - Resolution: `72` pixels/inch
   - Color Mode: `RGB Color`
   - Background Contents: `White` or `Background Color`
   - Click **OK**

2. **Design Your Image**
   - Add your app logo, text, or graphics
   - Use your app's color scheme:
     - Primary: #60a5fa (light blue)
     - Secondary: #34d399 (green)
     - Background: #111827 (dark gray)
     - Text: #f9fafb (light)

3. **Flatten the Image**
   - Layer → Flatten Image
   - This merges all layers into one

4. **Export/Save**
   - File → Export → Export As...
   - Format: **PNG** or **JPG**
   - Quality: 100% (for PNG) or 90-100% (for JPG)
   - Make sure "Embed Color Profile" is checked
   - Click **Export**

5. **Verify Settings**
   - Right-click the exported file → Properties → Details
   - Check: Dimensions = 1024 x 1024, Resolution = 72 dpi

---

## Method 2: Using GIMP (Free Alternative)

### Step-by-Step:

1. **Create New Image**
   - File → New
   - Width: `1024` px
   - Height: `1024` px
   - X resolution: `72` pixels/in
   - Y resolution: `72` pixels/in
   - Color space: **RGB**
   - Click **OK**

2. **Design Your Image**
   - Add layers, text, graphics as needed

3. **Flatten Image**
   - Image → Flatten Image
   - This merges all layers

4. **Export**
   - File → Export As...
   - Choose filename: `promotional-image.png` or `.jpg`
   - Click **Export**
   - For PNG: Click **Export** in dialog
   - For JPG: Set quality to 90-100, click **Export**

---

## Method 3: Using Canva (Online, Easy)

### Step-by-Step:

1. **Create Design**
   - Go to https://www.canva.com
   - Click "Create a design"
   - Choose "Custom size"
   - Width: `1024` px
   - Height: `1024` px
   - Click **Create new design**

2. **Design Your Image**
   - Add your app logo, text, graphics
   - Use Canva's design tools

3. **Download**
   - Click **Download** (top right)
   - File type: **PNG** or **JPG**
   - Quality: **High quality**
   - Click **Download**

4. **Verify & Convert (if needed)**
   - Canva may export at 300 dpi by default
   - Use ImageMagick or online tool to convert to 72 dpi (see Method 5)

---

## Method 4: Using Figma (Free for Individuals)

### Step-by-Step:

1. **Create Frame**
   - Create new file in Figma
   - Press `F` to create a frame
   - Set width: `1024` px
   - Set height: `1024` px
   - In right panel, set constraints if needed

2. **Design Your Image**
   - Add your design elements

3. **Export**
   - Select the frame
   - Right panel → Export section
   - Format: **PNG** or **JPG**
   - Click **Export [filename]**

4. **Note**: Figma exports at 1x by default (which is correct for 1024x1024)
   - You may need to verify/convert DPI (see Method 5)

---

## Method 5: Convert Existing Image to Meet Requirements

If you already have an image but it doesn't meet the requirements, use these methods:

### Option A: Using ImageMagick (Command Line)

**Install ImageMagick first** (if not installed):
- Windows: Download from https://imagemagick.org/script/download.php
- Mac: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

**Convert your image:**
```bash
# Resize to 1024x1024, set to 72 dpi, convert to RGB, flatten
magick input-image.png -resize 1024x1024^ -gravity center -extent 1024x1024 -density 72 -colorspace RGB -flatten promotional-image.png
```

**For JPG:**
```bash
magick input-image.png -resize 1024x1024^ -gravity center -extent 1024x1024 -density 72 -colorspace RGB -flatten -quality 90 promotional-image.jpg
```

### Option B: Using Online Tools

1. **Resize Image:**
   - Go to https://www.iloveimg.com/resize-image
   - Upload your image
   - Set custom size: 1024 x 1024 px
   - Click "Resize image"

2. **Convert DPI (if needed):**
   - Go to https://convert.town/image-dpi
   - Upload resized image
   - Set DPI to 72
   - Download converted image

3. **Convert to RGB (if needed):**
   - Most online tools export as RGB by default
   - If you have CMYK, use: https://convertio.co/cmyk-rgb/

### Option C: Using Python Script

Create a script to convert any image:

```python
from PIL import Image

# Open your image
img = Image.open('your-image.png')

# Convert to RGB (if not already)
if img.mode != 'RGB':
    img = img.convert('RGB')

# Resize to 1024x1024 (maintains aspect ratio, centers, crops if needed)
img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

# Create new 1024x1024 image with white background
new_img = Image.new('RGB', (1024, 1024), (255, 255, 255))

# Paste resized image centered
x_offset = (1024 - img.width) // 2
y_offset = (1024 - img.height) // 2
new_img.paste(img, (x_offset, y_offset))

# Save with 72 dpi
new_img.save('promotional-image.png', 'PNG', dpi=(72, 72))

print("✅ Image created: promotional-image.png")
print(f"   Size: {new_img.size}")
print(f"   Mode: {new_img.mode}")
```

**Run the script:**
```bash
pip install Pillow
python convert-promotional-image.py
```

---

## Method 6: Quick PowerShell Script (Windows)

If you're on Windows and have an existing image, here's a PowerShell script:

```powershell
# Install ImageMagick first, then run:
$inputImage = "your-image.png"
$outputImage = "promotional-image.png"

magick $inputImage `
    -resize 1024x1024^ `
    -gravity center `
    -extent 1024x1024 `
    -density 72 `
    -colorspace RGB `
    -flatten `
    $outputImage

Write-Host "✅ Created: $outputImage"
```

---

## Verification Checklist

Before uploading to App Store Connect, verify:

- [ ] File format is PNG or JPG
- [ ] Dimensions are exactly 1024 x 1024 pixels
- [ ] Resolution is 72 dpi
- [ ] Color mode is RGB (not CMYK)
- [ ] Image is flattened (no layers)
- [ ] No rounded corners (square edges)
- [ ] File size is reasonable (< 5MB recommended)

### How to Verify:

**Windows:**
- Right-click file → Properties → Details tab
- Check "Dimensions" and "Horizontal resolution" / "Vertical resolution"

**Mac:**
- Right-click file → Get Info
- Check dimensions and resolution

**Online:**
- Upload to https://www.picresize.com/view
- Check image properties

---

## Design Tips for Promotional Image

1. **Keep it Simple**: App Store promotional images are small, so use clear, bold designs
2. **Use Your Brand Colors**: Match your app's color scheme
3. **Include App Name**: Make sure your app name is readable
4. **Highlight Key Feature**: Show what makes your app unique
5. **Test at Small Size**: View the image at 200x200px to see how it looks small

---

## Quick Start: Create from App Icon

If you already have a 1024x1024 app icon, you can create a promotional image from it:

1. Open your `apps/mobile/assets/icon.png`
2. Add text or graphics around it
3. Export following Method 1, 2, or 3 above

---

## Need Help?

If you're stuck:
1. Use **Canva** (Method 3) - easiest for beginners
2. Use **ImageMagick** (Method 5) - best for converting existing images
3. Hire a designer on Fiverr or Upwork for $10-20

---

**Ready?** Create your image and upload it to App Store Connect! 🚀

