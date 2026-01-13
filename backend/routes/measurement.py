from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import MeasurementSettings, GoogleAdsConversion

router = APIRouter()

# Database
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# Default measurement settings
DEFAULT_SETTINGS = MeasurementSettings(
    gtm_container_id=None,
    gtm_enabled=True,
    ga4_measurement_id=None,
    ga4_enabled=True,
    ga4_debug_mode=False,
    google_ads_id=None,
    google_ads_enabled=True,
    google_ads_conversions=[
        GoogleAdsConversion(name="lead_form_submit", is_primary=True),
        GoogleAdsConversion(name="contact_click"),
        GoogleAdsConversion(name="service_cta_click"),
        GoogleAdsConversion(name="blog_to_service_click"),
    ],
    meta_pixel_id=None,
    meta_pixel_enabled=True,
    clarity_project_id=None,
    clarity_enabled=False,
    hotjar_site_id=None,
    hotjar_enabled=False,
    scroll_depth_thresholds=[25, 50, 75],
    time_on_page_thresholds=[30, 60],
)


# ============================================
# PUBLIC ROUTES (For frontend to load tracking)
# ============================================

@router.get("/config")
async def get_measurement_config():
    """
    Get measurement configuration for frontend.
    Returns only enabled tracking IDs - no sensitive data.
    This endpoint is public for the frontend to initialize tracking.
    """
    settings = await db.measurement_settings.find_one({}, {"_id": 0})
    
    if not settings:
        settings = DEFAULT_SETTINGS.model_dump()
    
    # Return only what frontend needs
    config = {
        "gtm": {
            "enabled": settings.get("gtm_enabled", True),
            "containerId": settings.get("gtm_container_id"),
        },
        "ga4": {
            "enabled": settings.get("ga4_enabled", True),
            "measurementId": settings.get("ga4_measurement_id"),
            "debugMode": settings.get("ga4_debug_mode", False),
        },
        "googleAds": {
            "enabled": settings.get("google_ads_enabled", True),
            "id": settings.get("google_ads_id"),
            "conversions": settings.get("google_ads_conversions", []),
        },
        "metaPixel": {
            "enabled": settings.get("meta_pixel_enabled", True),
            "pixelId": settings.get("meta_pixel_id"),
        },
        "clarity": {
            "enabled": settings.get("clarity_enabled", False),
            "projectId": settings.get("clarity_project_id"),
        },
        "hotjar": {
            "enabled": settings.get("hotjar_enabled", False),
            "siteId": settings.get("hotjar_site_id"),
        },
        "events": {
            "scrollDepthThresholds": settings.get("scroll_depth_thresholds", [25, 50, 75]),
            "timeOnPageThresholds": settings.get("time_on_page_thresholds", [30, 60]),
        }
    }
    
    return config


# ============================================
# ADMIN ROUTES (Auth required)
# ============================================

from routes.auth import get_current_user
from models import AdminUser

@router.get("/settings")
async def get_measurement_settings(current_user: AdminUser = Depends(get_current_user)):
    """Get full measurement settings (admin only)"""
    settings = await db.measurement_settings.find_one({}, {"_id": 0})
    
    if not settings:
        return DEFAULT_SETTINGS.model_dump()
    
    return settings


@router.put("/settings")
async def update_measurement_settings(
    payload: dict,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update measurement settings (admin only)"""
    
    # Validate certain fields
    if "gtm_container_id" in payload and payload["gtm_container_id"]:
        gtm_id = payload["gtm_container_id"]
        if not gtm_id.startswith("GTM-"):
            raise HTTPException(status_code=400, detail="GTM Container ID must start with 'GTM-'")
    
    if "ga4_measurement_id" in payload and payload["ga4_measurement_id"]:
        ga4_id = payload["ga4_measurement_id"]
        if not ga4_id.startswith("G-"):
            raise HTTPException(status_code=400, detail="GA4 Measurement ID must start with 'G-'")
    
    if "google_ads_id" in payload and payload["google_ads_id"]:
        ads_id = payload["google_ads_id"]
        if not ads_id.startswith("AW-"):
            raise HTTPException(status_code=400, detail="Google Ads ID must start with 'AW-'")
    
    # Add metadata
    payload["updated_at"] = datetime.now(timezone.utc)
    payload["updated_by"] = current_user.email
    
    # Check if settings exist
    existing = await db.measurement_settings.find_one({})
    
    if existing:
        await db.measurement_settings.update_one(
            {"_id": existing["_id"]},
            {"$set": payload}
        )
    else:
        # Merge with defaults
        full_settings = DEFAULT_SETTINGS.model_dump()
        full_settings.update(payload)
        await db.measurement_settings.insert_one(full_settings)
    
    # Return updated settings
    updated = await db.measurement_settings.find_one({}, {"_id": 0})
    return updated


@router.post("/settings/reset")
async def reset_measurement_settings(current_user: AdminUser = Depends(get_current_user)):
    """Reset measurement settings to defaults (admin only)"""
    await db.measurement_settings.delete_many({})
    
    default = DEFAULT_SETTINGS.model_dump()
    default["updated_at"] = datetime.now(timezone.utc)
    default["updated_by"] = current_user.email
    
    await db.measurement_settings.insert_one(default)
    
    return {"message": "Settings reset to defaults"}


@router.get("/test-config")
async def test_measurement_config(current_user: AdminUser = Depends(get_current_user)):
    """
    Test which tracking services are properly configured.
    Returns status for each service.
    """
    settings = await db.measurement_settings.find_one({}, {"_id": 0})
    
    if not settings:
        settings = DEFAULT_SETTINGS.model_dump()
    
    status = {
        "gtm": {
            "configured": bool(settings.get("gtm_container_id")),
            "enabled": settings.get("gtm_enabled", True),
            "containerId": settings.get("gtm_container_id"),
        },
        "ga4": {
            "configured": bool(settings.get("ga4_measurement_id")),
            "enabled": settings.get("ga4_enabled", True),
            "measurementId": settings.get("ga4_measurement_id"),
        },
        "googleAds": {
            "configured": bool(settings.get("google_ads_id")),
            "enabled": settings.get("google_ads_enabled", True),
            "id": settings.get("google_ads_id"),
            "conversionsConfigured": len([
                c for c in settings.get("google_ads_conversions", [])
                if c.get("conversion_label")
            ])
        },
        "metaPixel": {
            "configured": bool(settings.get("meta_pixel_id")),
            "enabled": settings.get("meta_pixel_enabled", True),
            "pixelId": settings.get("meta_pixel_id"),
        },
        "clarity": {
            "configured": bool(settings.get("clarity_project_id")),
            "enabled": settings.get("clarity_enabled", False),
        },
        "hotjar": {
            "configured": bool(settings.get("hotjar_site_id")),
            "enabled": settings.get("hotjar_enabled", False),
        }
    }
    
    # Calculate overall readiness
    required_services = ["gtm", "ga4"]
    all_required_configured = all(
        status[svc]["configured"] for svc in required_services
    )
    
    status["overall"] = {
        "ready": all_required_configured,
        "message": "Ready for production" if all_required_configured else "GTM and GA4 are required for measurement"
    }
    
    return status
