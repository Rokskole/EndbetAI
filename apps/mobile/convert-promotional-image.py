#!/usr/bin/env python3
"""
Convert any image to App Store promotional image format:
- 1024 x 1024 pixels
- 72 dpi
- RGB color mode
- Flattened (no layers)
- PNG or JPG format
"""

from PIL import Image
import sys
import os

def convert_to_promotional_image(input_path, output_path=None, format='PNG'):
    """
    Convert an image to App Store promotional image requirements.
    
    Args:
        input_path: Path to input image
        output_path: Path to output image (default: promotional-image.png/jpg)
        format: Output format ('PNG' or 'JPEG')
    """
    
    if not os.path.exists(input_path):
        print(f"❌ Error: File not found: {input_path}")
        return False
    
    try:
        # Open the image
        print(f"📖 Opening: {input_path}")
        img = Image.open(input_path)
        
        # Get original info
        print(f"   Original size: {img.size}")
        print(f"   Original mode: {img.mode}")
        
        # Convert to RGB if needed (removes transparency, converts CMYK, etc.)
        if img.mode != 'RGB':
            print(f"   Converting from {img.mode} to RGB...")
            # Create white background for transparency
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            else:
                img = img.convert('RGB')
        
        # Resize to fit 1024x1024 (maintains aspect ratio)
        # Using thumbnail to maintain aspect ratio
        img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        
        # Create new 1024x1024 image with white background
        new_img = Image.new('RGB', (1024, 1024), (255, 255, 255))
        
        # Calculate position to center the image
        x_offset = (1024 - img.width) // 2
        y_offset = (1024 - img.height) // 2
        
        # Paste resized image centered
        new_img.paste(img, (x_offset, y_offset))
        
        # Set output path
        if output_path is None:
            ext = '.png' if format == 'PNG' else '.jpg'
            output_path = f'promotional-image{ext}'
        
        # Save with 72 dpi
        if format == 'PNG':
            new_img.save(output_path, 'PNG', dpi=(72, 72))
        else:
            new_img.save(output_path, 'JPEG', quality=90, dpi=(72, 72))
        
        print(f"\n✅ Success! Created: {output_path}")
        print(f"   Size: {new_img.size} pixels")
        print(f"   Mode: {new_img.mode}")
        print(f"   Format: {format}")
        print(f"   DPI: 72")
        print(f"\n📋 Verification:")
        print(f"   ✓ Dimensions: 1024 x 1024")
        print(f"   ✓ Resolution: 72 dpi")
        print(f"   ✓ Color mode: RGB")
        print(f"   ✓ Flattened: Yes")
        print(f"   ✓ Format: {format}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def main():
    """Main function to handle command line arguments."""
    
    if len(sys.argv) < 2:
        print("Usage: python convert-promotional-image.py <input-image> [output-image] [format]")
        print("\nExamples:")
        print("  python convert-promotional-image.py icon.png")
        print("  python convert-promotional-image.py icon.png promotional.png PNG")
        print("  python convert-promotional-image.py icon.png promotional.jpg JPEG")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    format = sys.argv[3].upper() if len(sys.argv) > 3 else 'PNG'
    
    if format not in ('PNG', 'JPEG', 'JPG'):
        print(f"❌ Error: Format must be PNG or JPEG, got: {format}")
        sys.exit(1)
    
    if format == 'JPG':
        format = 'JPEG'
    
    success = convert_to_promotional_image(input_path, output_path, format)
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

