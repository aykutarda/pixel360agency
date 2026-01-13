from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Optional
from datetime import datetime, timezone
import os
import uuid
import base64
from io import BytesIO
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

# Database
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# Upload directory
UPLOAD_DIR = "/app/frontend/public/uploads/logos"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Try to import PIL for image processing
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


def process_image(image_data: bytes, max_width: int = 200, max_height: int = 80) -> bytes:
    """
    Process and resize image to optimal dimensions while maintaining aspect ratio.
    Returns the processed image bytes.
    """
    if not PIL_AVAILABLE:
        return image_data
    
    try:
        img = Image.open(BytesIO(image_data))
        
        # Convert to RGBA if necessary (for transparency support)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Keep transparency
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
        else:
            # Convert to RGB for JPEG
            img = img.convert('RGB')
        
        # Calculate new dimensions maintaining aspect ratio
        original_width, original_height = img.size
        
        # Calculate scaling factor
        width_ratio = max_width / original_width
        height_ratio = max_height / original_height
        scale_factor = min(width_ratio, height_ratio)
        
        # Only resize if image is larger than max dimensions
        if scale_factor < 1:
            new_width = int(original_width * scale_factor)
            new_height = int(original_height * scale_factor)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = BytesIO()
        
        # Determine format
        if img.mode == 'RGBA':
            img.save(output, format='PNG', optimize=True)
            return output.getvalue(), 'png'
        else:
            img.save(output, format='JPEG', quality=85, optimize=True)
            return output.getvalue(), 'jpg'
            
    except Exception as e:
        print(f"Image processing error: {e}")
        return image_data, 'png'


@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    brand_name: str = Form(...)
):
    """
    Upload a client logo image.
    - Accepts image files (jpg, jpeg, png, gif, webp, svg)
    - Auto-resizes to optimal dimensions (max 200x80)
    - Returns the URL path for the uploaded logo
    """
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: jpg, png, gif, webp, svg"
        )
    
    # Validate file size (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")
    
    # Generate unique filename
    file_id = str(uuid.uuid4())[:8]
    safe_brand = brand_name.lower().replace(' ', '-').replace('/', '-')[:30]
    
    # Process image (resize if needed)
    if file.content_type != 'image/svg+xml' and PIL_AVAILABLE:
        processed_data, ext = process_image(contents)
    else:
        processed_data = contents
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'png'
    
    # Save file
    filename = f"{safe_brand}_{file_id}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, 'wb') as f:
        f.write(processed_data)
    
    # Return the public URL path
    logo_url = f"/uploads/logos/{filename}"
    
    return {
        "success": True,
        "logo_url": logo_url,
        "brand_name": brand_name,
        "filename": filename
    }


@router.delete("/logo/{filename}")
async def delete_logo(filename: str):
    """Delete a logo file"""
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    if os.path.exists(filepath):
        os.remove(filepath)
        return {"success": True, "message": "Logo deleted"}
    else:
        raise HTTPException(status_code=404, detail="Logo not found")


@router.get("/logos")
async def list_logos():
    """List all uploaded logos"""
    logos = []
    
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
                logos.append({
                    "filename": filename,
                    "url": f"/uploads/logos/{filename}"
                })
    
    return {"logos": logos}
