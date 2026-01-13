from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import SiteSection, SiteSectionCreate

router = APIRouter()

# Database
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# Default site sections content
DEFAULT_SECTIONS = {
    "header": {
        "logo": "PIXEL360.",
        "nav_links": [
            {"name": "ANA SAYFA", "path": "/"},
            {"name": "HİZMETLER", "path": "#services"},
            {"name": "FRAMEWORK", "path": "#framework"},
            {"name": "BAŞARILAR", "path": "#portfolio"},
            {"name": "İLETİŞİM", "path": "#contact"}
        ],
        "cta_button": {
            "text": "STRATEJİ GÖRÜŞMESİ",
            "url": "#contact"
        },
        "phone": "+90 532 123 45 67"
    },
    "hero": {
        "badge": "AI-POWERED GROWTH AGENCY",
        "title": ["BÜYÜME", "MÜHENDİSLERİ"],
        "subtitle": "Sadece reklam yapmıyoruz. Büyüme üretiyoruz.",
        "description": "Yapay zeka destekli stratejiler, veri odaklı kararlar ve yaratıcı mükemmellikle markaları ölçeklenebilir başarıya taşıyoruz.",
        "primary_cta": {
            "text": "BÜYÜME STRATEJİNİZİ KONUŞALIM",
            "url": "#contact"
        },
        "secondary_cta": {
            "text": "BAŞARI HİKAYELERİ",
            "url": "#portfolio"
        },
        "tertiary_cta": {
            "text": "ÜCRETSİZ AI ANALİZ",
            "description": "Markanız için özel rapor",
            "url": "#contact"
        }
    },
    "stats": {
        "items": [
            {"number": "₺500M+", "label": "Yönetilen Bütçe"},
            {"number": "340%", "label": "Ortalama ROAS"},
            {"number": "150+", "label": "Büyüyen Marka"},
            {"number": "2.5x", "label": "Ort. Büyüme Oranı"}
        ]
    },
    "trust_badges": {
        "section_title": "Büyüme Ortaklarımız",
        "animation_speed": "slow",
        "logo_size": "large",
        "partners": [
            {"name": "Google Partner", "type": "premier"},
            {"name": "Meta Business Partner", "type": "partner"},
            {"name": "TikTok Marketing Partner", "type": "partner"},
            {"name": "HubSpot Certified", "type": "certified"}
        ],
        "client_logos": [
            {"name": "TechCorp", "logo": "TC"},
            {"name": "ModaPlus", "logo": "M+"},
            {"name": "FoodChain", "logo": "FC"},
            {"name": "HealthFirst", "logo": "HF"},
            {"name": "AutoDrive", "logo": "AD"},
            {"name": "EduLearn", "logo": "EL"},
            {"name": "FinanceHub", "logo": "FH"},
            {"name": "TravelGo", "logo": "TG"},
            {"name": "SportMax", "logo": "SM"},
            {"name": "BeautyLab", "logo": "BL"},
            {"name": "HomeStyle", "logo": "HS"},
            {"name": "GreenEnergy", "logo": "GE"}
        ]
    },
    "footer": {
        "logo": "PIXEL360.",
        "slogan": "AI-POWERED GROWTH AGENCY",
        "contact": {
            "phone": "+90 532 123 45 67",
            "email": "hello@pixel360.com.tr",
            "whatsapp": "905321234567",
            "address": "Levent, İstanbul"
        },
        "social_links": [
            {"platform": "linkedin", "url": "https://linkedin.com/company/pixel360"},
            {"platform": "instagram", "url": "https://instagram.com/pixel360"},
            {"platform": "twitter", "url": "https://twitter.com/pixel360"}
        ],
        "copyright": "© 2024 PIXEL360. Tüm hakları saklıdır.",
        "legal_links": [
            {"name": "Gizlilik Politikası", "url": "/gizlilik"},
            {"name": "Kullanım Şartları", "url": "/kullanim-sartlari"}
        ]
    },
    "why_us": {
        "badge": "NEDEN BIZ?",
        "title": "FARKIMIZ",
        "subtitle": "360° dijital büyüme yaklaşımımız",
        "items": [
            {
                "title": "AI-Destekli Optimizasyon",
                "description": "Makine öğrenmesi algoritmaları ile kampanyalarınızı 7/24 optimize ediyoruz.",
                "icon": "brain"
            },
            {
                "title": "Şeffaf Raporlama",
                "description": "Gerçek zamanlı dashboard'lar ile tüm metrikleri anlık takip edin.",
                "icon": "chart"
            },
            {
                "title": "Dedicated Ekip",
                "description": "Her müşterimize özel stratejist, kreatif ve medya uzmanı atıyoruz.",
                "icon": "users"
            },
            {
                "title": "Performans Garantisi",
                "description": "Hedeflere ulaşamazsak, ücret almıyoruz. Sonuç odaklı çalışıyoruz.",
                "icon": "target"
            }
        ]
    },
    "ai_capabilities": {
        "badge": "AI GÜCÜ",
        "title": "YAPAY ZEKA YETENEKLERİMİZ",
        "subtitle": "En son AI teknolojileri ile pazarlama performansınızı üst seviyeye taşıyoruz",
        "items": [
            {
                "name": "Akıllı Teklif Yönetimi",
                "description": "ML algoritmaları ile bid'leri otomatik optimize ediyoruz",
                "metric": "ROI +180%"
            },
            {
                "name": "Predictive Analytics",
                "description": "Gelecek performansı tahmin ederek proaktif aksiyonlar alıyoruz",
                "metric": "Accuracy %94"
            },
            {
                "name": "Creative AI",
                "description": "AI destekli reklam metinleri ve görsel optimizasyonu",
                "metric": "CTR +65%"
            },
            {
                "name": "Audience Intelligence",
                "description": "Hedef kitle segmentasyonu ve lookalike modelleme",
                "metric": "CPA -40%"
            },
            {
                "name": "Attribution AI",
                "description": "Çoklu temas noktası attribution modellemesi",
                "metric": "Insight +3x"
            },
            {
                "name": "Anomaly Detection",
                "description": "Performans anomalilerini anında tespit ve uyarı",
                "metric": "Response <1dk"
            }
        ]
    },
    "framework": {
        "badge": "METODOLOJI",
        "title": "360° BÜYÜME FRAMEWORK",
        "subtitle": "Kanıtlanmış metodolojimiz ile sürdürülebilir büyüme",
        "steps": [
            {
                "phase": "01",
                "name": "KEŞİF & ANALİZ",
                "description": "Mevcut durumunuzu, rakiplerinizi ve fırsatları derinlemesine analiz ediyoruz."
            },
            {
                "phase": "02",
                "name": "STRATEJİ & PLANLAMA",
                "description": "Veriye dayalı, ölçülebilir hedeflerle büyüme stratejisi oluşturuyoruz."
            },
            {
                "phase": "03",
                "name": "UYGULAMA & OPTİMİZASYON",
                "description": "AI destekli kampanyaları hayata geçiriyor, sürekli optimize ediyoruz."
            },
            {
                "phase": "04",
                "name": "ÖLÇÜMLEME & RAPORLAMA",
                "description": "Şeffaf raporlama ile ROI'nizi takip ediyor, aksiyonlar alıyoruz."
            }
        ]
    },
    "portfolio": {
        "badge": "BAŞARILARIMIZ",
        "title": "BAŞARI HİKAYELERİ",
        "subtitle": "Müşterilerimizle birlikte elde ettiğimiz sonuçlar",
        "projects": [
            {
                "name": "E-Ticaret Devi",
                "category": "E-Commerce",
                "result": "+340% ROAS",
                "description": "6 ayda ROAS'ı 3.4x artırdık"
            },
            {
                "name": "SaaS Startup",
                "category": "B2B SaaS",
                "result": "-65% CAC",
                "description": "Müşteri edinme maliyetini %65 düşürdük"
            },
            {
                "name": "Perakende Zinciri",
                "category": "Retail",
                "result": "+200% Traffic",
                "description": "Organik trafiği 3 ayda 3x artırdık"
            },
            {
                "name": "Fintech App",
                "category": "Finance",
                "result": "500K+ Install",
                "description": "App kurulum maliyetini %40 düşürdük"
            }
        ]
    },
    "testimonials": {
        "badge": "REFERANSLAR",
        "title": "MÜŞTERİLERİMİZ NE DİYOR?",
        "items": [
            {
                "name": "Ahmet Yılmaz",
                "title": "CEO",
                "company": "TechStartup",
                "quote": "Pixel360 ile çalışmaya başladıktan sonra ROAS'ımız 3x arttı. AI destekli optimizasyon gerçekten fark yaratıyor.",
                "avatar": "AY"
            },
            {
                "name": "Zeynep Kaya",
                "title": "Marketing Director",
                "company": "E-Commerce Co",
                "quote": "Şeffaf raporlama ve dedicated ekip yaklaşımları sayesinde tam kontrol sahibiyiz.",
                "avatar": "ZK"
            },
            {
                "name": "Mehmet Demir",
                "title": "Founder",
                "company": "SaaS Platform",
                "quote": "CAC'ımızı %60 düşürdüler. ROI odaklı çalışmaları bizi çok memnun etti.",
                "avatar": "MD"
            }
        ]
    },
    "contact": {
        "badge": "İLETİŞİM",
        "title": "BİRLİKTE BÜYÜYELİM",
        "subtitle": "Markanızın büyüme potansiyelini konuşalım",
        "form_title": "Ücretsiz Strateji Görüşmesi",
        "form_description": "30 dakikalık ücretsiz görüşmede büyüme fırsatlarınızı analiz edelim.",
        "form_cta": "GÖRÜŞME TALEP ET",
        "features": [
            "Ücretsiz marka analizi",
            "Rakip analizi raporu",
            "Büyüme yol haritası",
            "ROI projeksiyonu"
        ]
    }
}


# ============================================
# PUBLIC ROUTES (No auth required)
# ============================================

@router.get("/sections")
async def list_sections():
    """List all site sections (public)"""
    sections = await db.site_sections.find({}, {"_id": 0}).to_list(100)
    
    # Return defaults for missing sections
    result = {}
    for key in DEFAULT_SECTIONS.keys():
        found = next((s for s in sections if s.get("key") == key), None)
        if found:
            result[key] = found["payload"]
        else:
            result[key] = DEFAULT_SECTIONS[key]
    
    return result

@router.get("/sections/{key}")
async def get_section(key: str):
    """Get a specific site section (public)"""
    section = await db.site_sections.find_one({"key": key}, {"_id": 0})
    
    if section:
        return section["payload"]
    
    if key in DEFAULT_SECTIONS:
        return DEFAULT_SECTIONS[key]
    
    raise HTTPException(status_code=404, detail=f"Section '{key}' not found")


# ============================================
# ADMIN ROUTES (Auth required)
# ============================================

from routes.auth import get_current_user
from models import AdminUser

@router.put("/sections/{key}")
async def update_section(
    key: str,
    payload: dict,
    current_user: AdminUser = Depends(get_current_user)
):
    """Update a site section (admin only)"""
    valid_keys = list(DEFAULT_SECTIONS.keys())
    if key not in valid_keys:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid section key. Must be one of: {valid_keys}"
        )
    
    existing = await db.site_sections.find_one({"key": key})
    
    if existing:
        new_version = existing.get("version", 1) + 1
        await db.site_sections.update_one(
            {"key": key},
            {"$set": {
                "payload": payload,
                "version": new_version,
                "updated_at": datetime.now(timezone.utc),
                "updated_by": current_user.email
            }}
        )
    else:
        section = SiteSection(
            key=key,
            payload=payload,
            version=1,
            updated_by=current_user.email
        )
        await db.site_sections.insert_one(section.dict())
    
    updated = await db.site_sections.find_one({"key": key}, {"_id": 0})
    return updated

@router.post("/sections/seed")
async def seed_sections(current_user: AdminUser = Depends(get_current_user)):
    """Seed default sections (admin only)"""
    seeded = []
    for key, payload in DEFAULT_SECTIONS.items():
        existing = await db.site_sections.find_one({"key": key})
        if not existing:
            section = SiteSection(
                key=key,
                payload=payload,
                version=1,
                updated_by=current_user.email
            )
            await db.site_sections.insert_one(section.dict())
            seeded.append(key)
    
    return {
        "message": f"Seeded {len(seeded)} sections",
        "seeded": seeded
    }

@router.get("/sections/{key}/history")
async def get_section_history(
    key: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Get section version history (admin only) - simplified"""
    section = await db.site_sections.find_one({"key": key}, {"_id": 0})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return {
        "key": key,
        "current_version": section.get("version", 1),
        "updated_at": section.get("updated_at"),
        "updated_by": section.get("updated_by")
    }
