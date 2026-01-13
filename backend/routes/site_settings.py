from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import SiteSettings

router = APIRouter()

# Database
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# Default settings
DEFAULT_SETTINGS = SiteSettings(
    read_only_mode=False,
    read_only_message="Site şu anda bakım modunda. İçerik yayınlanamaz.",
)


# ============================================
# PUBLIC ROUTES
# ============================================

@router.get("/status")
async def get_site_status():
    """Get public site status (read-only mode check)"""
    settings = await db.site_settings.find_one({}, {"_id": 0})
    
    if not settings:
        settings = DEFAULT_SETTINGS.model_dump()
    
    return {
        "read_only_mode": settings.get("read_only_mode", False),
        "read_only_message": settings.get("read_only_message", "")
    }


# ============================================
# ADMIN ROUTES
# ============================================

from routes.auth import get_current_user
from models import AdminUser


@router.get("/settings")
async def get_site_settings(current_user: AdminUser = Depends(get_current_user)):
    """Get full site settings (admin only)"""
    settings = await db.site_settings.find_one({}, {"_id": 0})
    
    if not settings:
        return DEFAULT_SETTINGS.model_dump()
    
    return settings


@router.put("/settings")
async def update_site_settings(
    payload: dict,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update site settings (admin only)"""
    
    # Track when read-only mode was enabled
    existing = await db.site_settings.find_one({})
    was_read_only = existing.get("read_only_mode", False) if existing else False
    is_now_read_only = payload.get("read_only_mode", False)
    
    if not was_read_only and is_now_read_only:
        payload["read_only_started_at"] = datetime.now(timezone.utc)
        payload["read_only_started_by"] = current_user.email
    elif was_read_only and not is_now_read_only:
        payload["read_only_started_at"] = None
        payload["read_only_started_by"] = None
    
    payload["updated_at"] = datetime.now(timezone.utc)
    payload["updated_by"] = current_user.email
    
    if existing:
        await db.site_settings.update_one(
            {"_id": existing["_id"]},
            {"$set": payload}
        )
    else:
        full_settings = DEFAULT_SETTINGS.model_dump()
        full_settings.update(payload)
        await db.site_settings.insert_one(full_settings)
    
    updated = await db.site_settings.find_one({}, {"_id": 0})
    return updated


@router.post("/toggle-read-only")
async def toggle_read_only_mode(current_user: AdminUser = Depends(get_current_user)):
    """Quick toggle for read-only mode (admin only)"""
    settings = await db.site_settings.find_one({})
    
    if not settings:
        settings = DEFAULT_SETTINGS.model_dump()
        await db.site_settings.insert_one(settings)
        settings = await db.site_settings.find_one({})
    
    current_mode = settings.get("read_only_mode", False)
    new_mode = not current_mode
    
    update_data = {
        "read_only_mode": new_mode,
        "updated_at": datetime.now(timezone.utc),
        "updated_by": current_user.email
    }
    
    if new_mode:
        update_data["read_only_started_at"] = datetime.now(timezone.utc)
        update_data["read_only_started_by"] = current_user.email
    else:
        update_data["read_only_started_at"] = None
        update_data["read_only_started_by"] = None
    
    await db.site_settings.update_one(
        {"_id": settings["_id"]},
        {"$set": update_data}
    )
    
    return {
        "read_only_mode": new_mode,
        "message": "Read-only mode aktif edildi" if new_mode else "Read-only mode kapatıldı"
    }


# ============================================
# HELPER FOR OTHER ROUTES
# ============================================

async def check_read_only_mode():
    """Check if site is in read-only mode - to be used by CMS routes"""
    settings = await db.site_settings.find_one({}, {"_id": 0})
    if settings and settings.get("read_only_mode", False):
        raise HTTPException(
            status_code=403,
            detail=settings.get("read_only_message", "Site bakım modunda. İçerik yayınlanamaz.")
        )
