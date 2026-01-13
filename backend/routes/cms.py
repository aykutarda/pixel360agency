from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from models import (
    Service, ServiceCreate,
    BlogPost, BlogPostCreate,
    HubPage, HubPageCreate,
    Redirect, RedirectCreate,
    Author, AuthorCreate,
    Category, CategoryCreate,
    GlobalSettings
)
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# ============================================
# SERVICES CRUD
# ============================================

@router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate):
    """Create a new service page"""
    # Check slug uniqueness
    existing = await db.services.find_one({"seo_slug": service.seo_slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    service_dict = service.dict()
    service_obj = Service(**service_dict)
    await db.services.insert_one(service_obj.dict())
    return service_obj

@router.get("/services", response_model=List[Service])
async def list_services(
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """List all services"""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    services = await db.services.find(query).to_list(limit)
    return [Service(**s) for s in services]

@router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get service by ID"""
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)

@router.get("/services/by-slug/{slug}", response_model=Service)
async def get_service_by_slug(slug: str):
    """Get service by SEO slug"""
    service = await db.services.find_one({"seo_slug": slug})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)

@router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service: ServiceCreate):
    """Update a service"""
    existing = await db.services.find_one({"id": service_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check if slug changed and handle redirect
    old_slug = existing.get("seo_slug")
    new_slug = service.seo_slug
    old_status = existing.get("status")
    
    if old_slug != new_slug:
        # Check new slug uniqueness
        slug_exists = await db.services.find_one({"seo_slug": new_slug, "id": {"$ne": service_id}})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Only create redirect if the content was published (avoid draft noise)
        if old_status == "published":
            redirect = Redirect(
                from_path=f"/hizmetler/{old_slug}",
                to_path=f"/hizmetler/{new_slug}",
                status_code=301,
                note="Auto-generated on slug change"
            )
            await db.redirects.insert_one(redirect.dict())
    
    update_data = service.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.services.update_one({"id": service_id}, {"$set": update_data})
    updated = await db.services.find_one({"id": service_id})
    return Service(**updated)

@router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    """Delete a service"""
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}

# ============================================
# BLOG POSTS CRUD
# ============================================

@router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    """Create a new blog post"""
    existing = await db.blog_posts.find_one({"seo_slug": post.seo_slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    post_dict = post.dict()
    post_obj = BlogPost(**post_dict)
    await db.blog_posts.insert_one(post_obj.dict())
    return post_obj

@router.get("/blog", response_model=List[BlogPost])
async def list_blog_posts(
    status: Optional[str] = None,
    category_id: Optional[str] = None,
    hub_id: Optional[str] = None,
    service_id: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """List blog posts with filters"""
    query = {}
    if status:
        query["status"] = status
    if category_id:
        query["category_id"] = category_id
    if hub_id:
        query["belongs_to_hub_id"] = hub_id
    if service_id:
        query["supports_service_id"] = service_id
    if tag:
        query["tags"] = tag
    
    posts = await db.blog_posts.find(query).sort("created_at", -1).to_list(limit)
    return [BlogPost(**p) for p in posts]

@router.get("/blog/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    """Get blog post by ID"""
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@router.get("/blog/by-slug/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Get blog post by SEO slug"""
    post = await db.blog_posts.find_one({"seo_slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post: BlogPostCreate):
    """Update a blog post"""
    existing = await db.blog_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    old_slug = existing.get("seo_slug")
    new_slug = post.seo_slug
    
    if old_slug != new_slug:
        slug_exists = await db.blog_posts.find_one({"seo_slug": new_slug, "id": {"$ne": post_id}})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        redirect = Redirect(
            from_path=f"/blog/{old_slug}",
            to_path=f"/blog/{new_slug}",
            status_code=301,
            note="Auto-generated on slug change"
        )
        await db.redirects.insert_one(redirect.dict())
    
    update_data = post.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    updated = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**updated)

@router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    """Delete a blog post"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted"}

# ============================================
# HUB PAGES CRUD
# ============================================

@router.post("/hubs", response_model=HubPage)
async def create_hub(hub: HubPageCreate):
    """Create a new hub page"""
    existing = await db.hubs.find_one({"seo_slug": hub.seo_slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    hub_dict = hub.dict()
    hub_obj = HubPage(**hub_dict)
    await db.hubs.insert_one(hub_obj.dict())
    return hub_obj

@router.get("/hubs", response_model=List[HubPage])
async def list_hubs(status: Optional[str] = None, limit: int = Query(default=100, le=100)):
    """List all hub pages"""
    query = {}
    if status:
        query["status"] = status
    
    hubs = await db.hubs.find(query).to_list(limit)
    return [HubPage(**h) for h in hubs]

@router.get("/hubs/{hub_id}", response_model=HubPage)
async def get_hub(hub_id: str):
    """Get hub by ID"""
    hub = await db.hubs.find_one({"id": hub_id})
    if not hub:
        raise HTTPException(status_code=404, detail="Hub not found")
    return HubPage(**hub)

@router.get("/hubs/by-slug/{slug}", response_model=HubPage)
async def get_hub_by_slug(slug: str):
    """Get hub by SEO slug"""
    hub = await db.hubs.find_one({"seo_slug": slug})
    if not hub:
        raise HTTPException(status_code=404, detail="Hub not found")
    return HubPage(**hub)

@router.put("/hubs/{hub_id}", response_model=HubPage)
async def update_hub(hub_id: str, hub: HubPageCreate):
    """Update a hub page"""
    existing = await db.hubs.find_one({"id": hub_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Hub not found")
    
    old_slug = existing.get("seo_slug")
    new_slug = hub.seo_slug
    
    if old_slug != new_slug:
        slug_exists = await db.hubs.find_one({"seo_slug": new_slug, "id": {"$ne": hub_id}})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        redirect = Redirect(
            from_path=f"/konular/{old_slug}",
            to_path=f"/konular/{new_slug}",
            status_code=301,
            note="Auto-generated on slug change"
        )
        await db.redirects.insert_one(redirect.dict())
    
    update_data = hub.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.hubs.update_one({"id": hub_id}, {"$set": update_data})
    updated = await db.hubs.find_one({"id": hub_id})
    return HubPage(**updated)

@router.delete("/hubs/{hub_id}")
async def delete_hub(hub_id: str):
    """Delete a hub page"""
    result = await db.hubs.delete_one({"id": hub_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hub not found")
    return {"message": "Hub deleted"}

# ============================================
# REDIRECTS CRUD
# ============================================

@router.post("/redirects", response_model=Redirect)
async def create_redirect(redirect: RedirectCreate):
    """Create a new redirect"""
    redirect_obj = Redirect(**redirect.dict())
    await db.redirects.insert_one(redirect_obj.dict())
    return redirect_obj

@router.get("/redirects", response_model=List[Redirect])
async def list_redirects(is_active: Optional[bool] = None):
    """List all redirects"""
    query = {}
    if is_active is not None:
        query["is_active"] = is_active
    
    redirects = await db.redirects.find(query).to_list(1000)
    return [Redirect(**r) for r in redirects]

@router.get("/redirects/check")
async def check_redirect(path: str):
    """Check if a path has a redirect"""
    redirect = await db.redirects.find_one({"from_path": path, "is_active": True})
    if redirect:
        return {"has_redirect": True, "to_path": redirect["to_path"], "status_code": redirect["status_code"]}
    return {"has_redirect": False}

@router.delete("/redirects/{redirect_id}")
async def delete_redirect(redirect_id: str):
    """Delete a redirect"""
    result = await db.redirects.delete_one({"id": redirect_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Redirect not found")
    return {"message": "Redirect deleted"}

# ============================================
# AUTHORS CRUD
# ============================================

@router.post("/authors", response_model=Author)
async def create_author(author: AuthorCreate):
    """Create a new author"""
    author_obj = Author(**author.dict())
    await db.authors.insert_one(author_obj.dict())
    return author_obj

@router.get("/authors", response_model=List[Author])
async def list_authors():
    """List all authors"""
    authors = await db.authors.find().to_list(100)
    return [Author(**a) for a in authors]

@router.get("/authors/{author_id}", response_model=Author)
async def get_author(author_id: str):
    """Get author by ID"""
    author = await db.authors.find_one({"id": author_id})
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return Author(**author)

# ============================================
# CATEGORIES CRUD
# ============================================

@router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    category_obj = Category(**category.dict())
    await db.categories.insert_one(category_obj.dict())
    return category_obj

@router.get("/categories", response_model=List[Category])
async def list_categories():
    """List all categories"""
    categories = await db.categories.find().to_list(100)
    return [Category(**c) for c in categories]

# ============================================
# GLOBAL SETTINGS
# ============================================

@router.get("/settings", response_model=GlobalSettings)
async def get_settings():
    """Get global site settings"""
    settings = await db.settings.find_one({"id": {"$exists": True}})
    if not settings:
        # Create default settings
        default_settings = GlobalSettings()
        await db.settings.insert_one(default_settings.dict())
        return default_settings
    return GlobalSettings(**settings)

@router.put("/settings", response_model=GlobalSettings)
async def update_settings(settings: GlobalSettings):
    """Update global site settings"""
    settings_dict = settings.dict()
    settings_dict["updated_at"] = datetime.utcnow()
    
    existing = await db.settings.find_one({"id": {"$exists": True}})
    if existing:
        await db.settings.update_one({"id": existing["id"]}, {"$set": settings_dict})
    else:
        await db.settings.insert_one(settings_dict)
    
    updated = await db.settings.find_one({"id": {"$exists": True}})
    return GlobalSettings(**updated)
