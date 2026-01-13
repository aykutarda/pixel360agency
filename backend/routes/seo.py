from fastapi import APIRouter, Response
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

BASE_URL = "https://pixel360.com.tr"  # Will be configurable from settings

@router.get("/sitemap.xml")
async def generate_sitemap():
    """Generate XML sitemap dynamically"""
    
    urls = []
    
    # Homepage
    urls.append({
        "loc": BASE_URL,
        "lastmod": datetime.utcnow().strftime("%Y-%m-%d"),
        "changefreq": "weekly",
        "priority": "1.0"
    })
    
    # Services
    services = await db.services.find({"status": "published", "seo_robots": {"$ne": "noindex,follow"}}).to_list(1000)
    for service in services:
        urls.append({
            "loc": f"{BASE_URL}/hizmetler/{service['seo_slug']}",
            "lastmod": service.get('updated_at', datetime.utcnow()).strftime("%Y-%m-%d") if isinstance(service.get('updated_at'), datetime) else datetime.utcnow().strftime("%Y-%m-%d"),
            "changefreq": "monthly",
            "priority": "0.9"
        })
    
    # Blog posts
    posts = await db.blog_posts.find({"status": "published", "seo_robots": {"$ne": "noindex,follow"}}).to_list(1000)
    for post in posts:
        urls.append({
            "loc": f"{BASE_URL}/blog/{post['seo_slug']}",
            "lastmod": post.get('updated_at', datetime.utcnow()).strftime("%Y-%m-%d") if isinstance(post.get('updated_at'), datetime) else datetime.utcnow().strftime("%Y-%m-%d"),
            "changefreq": "weekly",
            "priority": "0.7"
        })
    
    # Hub pages
    hubs = await db.hubs.find({"status": "published", "seo_robots": {"$ne": "noindex,follow"}}).to_list(1000)
    for hub in hubs:
        urls.append({
            "loc": f"{BASE_URL}/konular/{hub['seo_slug']}",
            "lastmod": hub.get('updated_at', datetime.utcnow()).strftime("%Y-%m-%d") if isinstance(hub.get('updated_at'), datetime) else datetime.utcnow().strftime("%Y-%m-%d"),
            "changefreq": "weekly",
            "priority": "0.8"
        })
    
    # Generate XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{url["loc"]}</loc>\n'
        xml_content += f'    <lastmod>{url["lastmod"]}</lastmod>\n'
        xml_content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{url["priority"]}</priority>\n'
        xml_content += '  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")

@router.get("/robots.txt")
async def get_robots():
    """Get robots.txt from settings"""
    settings = await db.settings.find_one({"id": {"$exists": True}})
    
    if settings and settings.get("robots_txt"):
        robots_content = settings["robots_txt"]
    else:
        robots_content = f"""User-agent: *
Allow: /

Sitemap: {BASE_URL}/sitemap.xml"""
    
    return Response(content=robots_content, media_type="text/plain")

@router.get("/sitemap/stats")
async def sitemap_stats():
    """Get sitemap statistics"""
    services_count = await db.services.count_documents({"status": "published"})
    posts_count = await db.blog_posts.count_documents({"status": "published"})
    hubs_count = await db.hubs.count_documents({"status": "published"})
    
    return {
        "total_urls": 1 + services_count + posts_count + hubs_count,
        "breakdown": {
            "homepage": 1,
            "services": services_count,
            "blog_posts": posts_count,
            "hub_pages": hubs_count
        },
        "last_generated": datetime.utcnow().isoformat()
    }
