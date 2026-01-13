from fastapi import APIRouter
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import (
    Service, ServiceCreate, BlogPost, BlogPostCreate, 
    HubPage, HubPageCreate, Author, AuthorCreate, Category, CategoryCreate
)
from datetime import datetime
import uuid

router = APIRouter()

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

# ============================================
# SEED DATA
# ============================================

SEED_AUTHORS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Pixel360 Ekibi",
        "slug": "pixel360-ekibi",
        "bio": "Pixel360 içerik ve strateji ekibi.",
        "role": "Content Team"
    }
]

SEED_CATEGORIES = [
    {"id": str(uuid.uuid4()), "name": "Google Ads", "slug": "google-ads"},
    {"id": str(uuid.uuid4()), "name": "Meta Ads", "slug": "meta-ads"},
    {"id": str(uuid.uuid4()), "name": "SEO", "slug": "seo"},
    {"id": str(uuid.uuid4()), "name": "Dijital Pazarlama", "slug": "dijital-pazarlama"}
]

SEED_SERVICES = [
    {
        "name": "Google Ads Yönetimi",
        "category": "performance",
        "hero_h1": "Google Ads Yönetimi | Dönüşüm Odaklı Kampanya Yönetimi",
        "hero_summary": "AI-destekli Google Ads yönetimi ile reklam harcamalarınızdan maksimum verim alın. Arama ağı, alışveriş, PMAX ve yeniden pazarlama kampanyalarında uzman ekibimizle tanışın.",
        "problem_block": "<p>Birçok marka Google Ads'é bütçe ayırıyor ancak beklediği dönüşümleri alamıyor. Yanlış anahtar kelime stratejisi, zayıf reklam metinleri ve eksik dönüşüm takibi en sık karşılaşılan sorunlar.</p>",
        "solution_block": "<p>AI-destekli analiz ve optimizasyon sistemlerimizle kampanyalarınızı sürekli iyileştiriyoruz. Predictive bidding, dinamik anahtar kelime yönetimi ve A/B test süreçleriyle ROAS'ınızı maksimize ediyoruz.</p>",
        "process_steps": [
            {"title": "Audit & Analiz", "description": "Mevcut hesap yapısı ve performans analizi"},
            {"title": "Strateji", "description": "Hedeflere uygun kampanya mimarisi tasarimi"},
            {"title": "Kurulum", "description": "Kampanya, reklam grubu ve reklam yapılandırması"},
            {"title": "Optimizasyon", "description": "Sürekli AI-destekli optimizasyon"}
        ],
        "deliverables": ["Kampanya Mimarisi", "Anahtar Kelime Stratejisi", "Reklam Metinleri", "Dönüşüm Takibi", "Aylık Raporlama"],
        "kpi_outcomes": [
            {"metric_name": "ROAS Artışı", "value": "%200-400", "note": "Sektöre göre değişir"},
            {"metric_name": "CPA Düşüşü", "value": "%30-50", "note": ""}
        ],
        "seo_title": "Google Ads Yönetimi | Dönüşüm Odaklı Kampanya Yönetimi | Pixel360",
        "seo_description": "Arama ağı, PMAX ve yeniden pazarlama kampanyalarıyla ölçülebilir büyüme. AI-destekli Google Ads yönetimi ile ROAS'inizi artırın.",
        "seo_slug": "google-ads-yonetimi",
        "seo_focus_keyword": "google ads yönetimi",
        "seo_secondary_keywords": ["google reklam ajansı", "google ads danışmanlığı", "arama ağı reklamları", "pmax kampanya"],
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "Google Ads yönetimi neleri kapsar?", "answer": "Kampanya mimarisi, anahtar kelime ve negatif yönetimi, reklam metinleri, bütçe stratejisi ve dönüşüm takibi optimizasyonunu kapsar."},
            {"question": "Ne kadar sürede sonuç alınır?", "answer": "Sektör ve bütçeye bağlıdır; genellikle ilk 2-4 hafta içinde öğrenme ve optimizasyonla ölçülebilir iyileşme görülür."}
        ],
        "status": "published"
    },
    {
        "name": "Meta Ads Yönetimi",
        "category": "performance",
        "hero_h1": "Meta Ads Yönetimi | Facebook & Instagram Reklam Yönetimi",
        "hero_summary": "Facebook ve Instagram reklamlarıyla hedef kitlenize ulaşın. AI-destekli hedefleme, dinamik kreatifler ve sürekli optimizasyonla sosyal medya reklamlarından maksimum verim alın.",
        "problem_block": "<p>Sosyal medya reklamları doğru yönetilmediğinde bütçe israfına dönüşür. Yanlış hedef kitle, etkisiz kreatifler ve yetersiz funnel yapısı en büyük sorunlardır.</p>",
        "solution_block": "<p>Pixel360 olarak AI-powered audience segmentation, dynamic creative optimization ve full-funnel strateji ile Meta platformlarında ölçülebilir sonuçlar üretiyoruz.</p>",
        "process_steps": [
            {"title": "Hedef Kitle Analizi", "description": "AI ile ideal müşteri profili çıkarma"},
            {"title": "Kreatif Strateji", "description": "Platforma özel içerik üretimi"},
            {"title": "Kampanya Kurulumu", "description": "Full-funnel kampanya mimarisi"},
            {"title": "Optimizasyon", "description": "Günlük performans takibi ve iyileştirme"}
        ],
        "deliverables": ["Hedef Kitle Stratejisi", "Reklam Kreatifleri", "Kampanya Yönetimi", "Retargeting Kurulumu", "Performans Raporları"],
        "kpi_outcomes": [
            {"metric_name": "ROAS", "value": "3x-5x", "note": ""},
            {"metric_name": "CPM Düşüşü", "value": "%25-40", "note": ""}
        ],
        "seo_title": "Meta Ads Yönetimi | Facebook & Instagram Reklam Ajansı | Pixel360",
        "seo_description": "Facebook ve Instagram reklamlarında AI-destekli hedefleme ve optimizasyon. Meta Business Partner sertifikalı ekibimizle tanışın.",
        "seo_slug": "meta-ads-yonetimi",
        "seo_focus_keyword": "meta ads yönetimi",
        "seo_secondary_keywords": ["facebook reklam ajansı", "instagram reklam yönetimi", "sosyal medya reklamları"],
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "Meta Ads ile hangi platformlarda reklam verilir?", "answer": "Facebook, Instagram, Messenger ve Audience Network platformlarında reklam verilebilir."},
            {"question": "Minimum bütçe ne kadar olmalı?", "answer": "Etkili sonuçlar için aylık minimum 10.000 TL reklam bütçesi öneriyoruz."}
        ],
        "status": "published"
    },
    {
        "name": "SEO Hizmeti",
        "category": "seo",
        "hero_h1": "SEO Hizmeti | Organik Arama Optimizasyonu",
        "hero_summary": "Google'ın ilk sayfasında yer alın. Teknik SEO, içerik stratejisi ve link building ile organik trafiğinizi katlayın.",
        "problem_block": "<p>Organik arama trafiği, sürdürülebilir büyümenin temelidir. Ancak birçok site teknik sorunlar, zayıf içerik ve yetersiz backlink profili nedeniyle Google'da görünmüyor.</p>",
        "solution_block": "<p>360° SEO yaklaşımımızla teknik altyapı, içerik stratejisi ve off-page çalışmaları entegre ederek sürdürülebilir organik büyüme sağlıyoruz.</p>",
        "process_steps": [
            {"title": "Teknik Audit", "description": "Site altyapısı ve Core Web Vitals analizi"},
            {"title": "Anahtar Kelime Araştırması", "description": "Fırsat ve rekabet analizi"},
            {"title": "İçerik Stratejisi", "description": "Topical authority odaklı içerik planı"},
            {"title": "Link Building", "description": "Kaliteli backlink kazandırma"}
        ],
        "deliverables": ["Teknik SEO Düzeltmeleri", "Anahtar Kelime Haritası", "İçerik Takvimi", "Backlink Stratejisi", "Aylık SEO Raporu"],
        "kpi_outcomes": [
            {"metric_name": "Organik Trafik Artışı", "value": "%100-300", "note": "6-12 ay içinde"},
            {"metric_name": "İlk Sayfa Anahtar Kelime", "value": "20-50+", "note": ""}
        ],
        "seo_title": "SEO Hizmeti | Organik Arama Optimizasyonu | Pixel360",
        "seo_description": "Teknik SEO, içerik stratejisi ve link building ile Google'ın ilk sayfasına çıkın. Veri odaklı SEO ajansı Pixel360.",
        "seo_slug": "seo-hizmeti",
        "seo_focus_keyword": "seo hizmeti",
        "seo_secondary_keywords": ["seo ajansı", "arama motoru optimizasyonu", "organik trafik", "google sıralama"],
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "SEO ne kadar sürede sonuç verir?", "answer": "SEO uzun vadeli bir yatırımdır. İlk sonuçlar 3-6 ay içinde görülmeye başlar, kalıcı sonuçlar için 6-12 ay gerekir."},
            {"question": "SEO maliyeti nasıl belirlenir?", "answer": "Site büyüklüğü, rekabet düzeyi ve hedeflere göre özel fiyatlandırma yapılır."}
        ],
        "status": "published"
    }
]

SEED_HUBS = [
    {
        "title": "Google Ads Rehberi",
        "intro": "<p>Google Ads hakkında bilmeniz gereken her şey. Kampanya kurulumundan optimizasyona, raporlamadan ileri seviye stratejilere kadar kapsamlı rehber.</p>",
        "primary_keyword": "google ads",
        "secondary_keywords": ["google reklamları", "google ads eğitim", "adwords"],
        "seo_title": "Google Ads Rehberi | Kapsamlı Google Reklamları Kılavuzu",
        "seo_description": "Google Ads hakkında A'dan Z'ye rehber. Kampanya türleri, hedefleme, optimizasyon ve ileri stratejiler. Pixel360 uzmanlarından.",
        "seo_slug": "google-ads",
        "seo_focus_keyword": "google ads rehberi",
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "Google Ads nedir?", "answer": "Google Ads, Google'un reklam platformudur. Arama sonuçları, YouTube, Gmail ve partner sitelerde reklam vermenizi sağlar."},
            {"question": "Google Ads nasıl çalışır?", "answer": "Açık artırma sistemiyle çalışır. Anahtar kelimelere teklif verir, kalite puanı ve teklif tutarına göre reklamınız gösterilir."}
        ],
        "status": "published"
    },
    {
        "title": "Meta Ads Rehberi",
        "intro": "<p>Facebook ve Instagram reklamları hakkında kapsamlı kılavuz. Hedefleme, reklam formatları, bütçe yönetimi ve optimizasyon ipucları.</p>",
        "primary_keyword": "meta ads",
        "secondary_keywords": ["facebook reklamları", "instagram reklamları", "sosyal medya reklamları"],
        "seo_title": "Meta Ads Rehberi | Facebook & Instagram Reklam Kılavuzu",
        "seo_description": "Meta Ads platformunda başarılı reklam kampanyaları oluşturma rehberi. Hedefleme, kreatif ve optimizasyon stratejileri.",
        "seo_slug": "meta-ads",
        "seo_focus_keyword": "meta ads rehberi",
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "Meta Ads ile Facebook Ads aynı şey mi?", "answer": "Evet, Facebook şirket adını Meta olarak değiştirdiği için Facebook Ads artık Meta Ads olarak anılıyor."},
            {"question": "Meta Ads B2B için uygun mu?", "answer": "Evet, özellikle LinkedIn entegrasyonu ve detaylı hedefleme seçenekleriyle B2B için de etkili sonuçlar alınabilir."}
        ],
        "status": "published"
    },
    {
        "title": "SEO Rehberi",
        "intro": "<p>Arama motoru optimizasyonu hakkında kapsamlı rehber. Teknik SEO, içerik stratejisi, link building ve local SEO konularında uzman bilgisi.</p>",
        "primary_keyword": "seo",
        "secondary_keywords": ["arama motoru optimizasyonu", "seo nasıl yapılır", "organik trafik"],
        "seo_title": "SEO Rehberi | Arama Motoru Optimizasyonu Kılavuzu",
        "seo_description": "SEO hakkında bilmeniz gereken her şey. Teknik SEO, içerik, link building stratejileri. Pixel360 SEO uzmanlarından.",
        "seo_slug": "seo",
        "seo_focus_keyword": "seo rehberi",
        "seo_schema_faq_enabled": True,
        "seo_schema_faq_items": [
            {"question": "SEO nedir?", "answer": "SEO (Search Engine Optimization), web sitenizin arama motorlarında üst sıralarda yer almasını sağlayan optimizasyon çalışmalarıdır."},
            {"question": "SEO neden önemli?", "answer": "Organik arama trafiği, sürdürülebilir ve maliyet etkin bir müşteri kazanım kanalıdır. İyi SEO ile reklam harcamadan müşteri kazanabilirsiniz."}
        ],
        "status": "published"
    }
]

SEED_BLOG_POSTS = [
    # Google Ads Hub Posts
    {
        "title": "Google Ads'te En Sık Yapılan 12 Hata ve Çözümü",
        "excerpt": "Bütçeyi boşa harcatan Google Ads hataları ve bunları nasıl düzelteceğinizi adım adım anlatıyoruz.",
        "content": "<h2>Giriş</h2><p>Google Ads, doğru yönetildiğinde işletmenizi büyütecek en güçlü araçlardan biridir. Ancak birçok reklam veren, basit hatalar nedeniyle bütçelerini boşa harcamaktadır.</p><h2>1. Geniş Eşleme Yanlış Kullanımı</h2><p>Geniş eşleme anahtar kelimeler, alakasız aramalarda görünmenize neden olabilir...</p><h2>2. Negatif Anahtar Kelime Eksikliği</h2><p>Negatif anahtar kelime eklemeden kampanya yönetmek, bütçe israfına yol açar...</p><h2>3. Dönüşüm Takibi Eksikliği</h2><p>Dönüşüm takibi olmadan optimizasyon yapmanız mümkün değildir...</p>",
        "intent_type": "informational",
        "tags": ["google ads", "ppc", "reklam hataları"],
        "seo_title": "Google Ads'te En Sık Yapılan 12 Hata ve Çözümü | Pixel360",
        "seo_description": "Bütçeyi boşa harcatan Google Ads hataları: yanlış eşleme, eksik negatifler, zayıf dönüşüm takibi. Adım adım düzeltme rehberi.",
        "seo_slug": "google-ads-hatalari",
        "seo_focus_keyword": "google ads hataları",
        "seo_secondary_keywords": ["google ads optimizasyon", "adwords hataları", "reklam bütçesi"],
        "status": "published"
    },
    {
        "title": "Google Ads Kalite Puanı Nasıl Yükseltilir?",
        "excerpt": "Kalite puanınızı artırarak daha düşük maliyetle daha iyi sonuçlar alın.",
        "content": "<h2>Kalite Puanı Nedir?</h2><p>Kalite puanı, Google'un reklamlarınızın kalitesini ölçtüğü 1-10 arası bir metriktir...</p><h2>Kalite Puanını Etkileyen Faktörler</h2><p>1. Beklenen Tıklama Oranı (CTR)<br>2. Reklam Alışkanlığı<br>3. Varış Sayfası Deneyimi</p>",
        "intent_type": "informational",
        "tags": ["google ads", "kalite puanı", "optimizasyon"],
        "seo_title": "Google Ads Kalite Puanı Nasıl Yükseltilir? | Pixel360",
        "seo_description": "Google Ads kalite puanınızı artırmak için uygulamalı rehber. CTR, reklam algısı ve landing page optimizasyonu.",
        "seo_slug": "google-ads-kalite-puani",
        "seo_focus_keyword": "google ads kalite puanı",
        "seo_secondary_keywords": ["quality score", "reklam optimizasyonu"],
        "status": "published"
    },
    # Meta Ads Hub Posts
    {
        "title": "Facebook Reklam Hedefleme: Detaylı Kılavuz",
        "excerpt": "Facebook'un güçlü hedefleme özelliklerini kullanarak ideal müşterinize ulaşın.",
        "content": "<h2>Facebook Hedefleme Seçenekleri</h2><p>Facebook, dünyanın en detaylı hedefleme seçeneklerini sunan reklam platformlarından biridir...</p><h2>Temel Hedefleme</h2><p>Demografik bilgiler, konum, yaş ve cinsiyet...</p><h2>Detaylı Hedefleme</h2><p>İlgi alanları, davranışlar ve bağlantılar...</p>",
        "intent_type": "informational",
        "tags": ["facebook ads", "hedefleme", "sosyal medya"],
        "seo_title": "Facebook Reklam Hedefleme: Detaylı Kılavuz 2025 | Pixel360",
        "seo_description": "Facebook reklam hedefleme seçenekleri: demografik, ilgi alanı, davranış ve özel hedef kitle oluşturma. Uygulamalı rehber.",
        "seo_slug": "facebook-reklam-hedefleme",
        "seo_focus_keyword": "facebook reklam hedefleme",
        "seo_secondary_keywords": ["facebook hedef kitle", "meta ads targeting"],
        "status": "published"
    },
    {
        "title": "Instagram Reklam Türleri ve Kullanım Alanları",
        "excerpt": "Hangi Instagram reklam formatı hangi hedef için en uygun? Detaylı karşılaştırma.",
        "content": "<h2>Instagram Reklam Formatları</h2><p>Instagram, farklı hedefler için çeşitli reklam formatları sunar...</p><h2>Story Reklamları</h2><p>Tam ekran, dikkat çekici format...</p><h2>Reels Reklamları</h2><p>Kısa video içeriklerle yüksek etkileşim...</p>",
        "intent_type": "informational",
        "tags": ["instagram ads", "reklam formatları", "sosyal medya"],
        "seo_title": "Instagram Reklam Türleri ve Kullanım Alanları | Pixel360",
        "seo_description": "Instagram reklam formatları: Story, Feed, Reels, Carousel. Hangi format hangi hedef için? Detaylı karşılaştırma ve öneriler.",
        "seo_slug": "instagram-reklam-turleri",
        "seo_focus_keyword": "instagram reklam türleri",
        "seo_secondary_keywords": ["instagram reklamları", "ig ads", "story reklamları"],
        "status": "published"
    },
    # SEO Hub Posts
    {
        "title": "Teknik SEO Kontrol Listesi: 50+ Madde",
        "excerpt": "Web sitenizin teknik SEO sağlığını kontrol etmek için kapsamlı checklist.",
        "content": "<h2>Teknik SEO Nedir?</h2><p>Teknik SEO, arama motorlarının sitenizi daha iyi tarayabilmesi ve indexleyebilmesi için yapılan optimizasyonlardır...</p><h2>Crawlability</h2><p>Robots.txt, XML Sitemap, site yapısı...</p><h2>Core Web Vitals</h2><p>LCP, FID, CLS metrikleri...</p>",
        "intent_type": "informational",
        "tags": ["teknik seo", "seo checklist", "web performans"],
        "seo_title": "Teknik SEO Kontrol Listesi: 50+ Madde | Pixel360",
        "seo_description": "Kapsamlı teknik SEO kontrol listesi. Crawlability, indexing, Core Web Vitals, site hızı ve daha fazlası.",
        "seo_slug": "teknik-seo-kontrol-listesi",
        "seo_focus_keyword": "teknik seo",
        "seo_secondary_keywords": ["seo checklist", "site hızı", "core web vitals"],
        "status": "published"
    },
    {
        "title": "Anahtar Kelime Araştırması Nasıl Yapılır?",
        "excerpt": "Etkili anahtar kelime araştırması için adım adım rehber ve araç önerileri.",
        "content": "<h2>Anahtar Kelime Araştırmasının Önemi</h2><p>SEO stratejinizin temeli anahtar kelime araştırmasıdır...</p><h2>Araştırma Araçları</h2><p>Google Keyword Planner, Ahrefs, SEMrush...</p><h2>Niyet Analizi</h2><p>Informational vs commercial vs transactional...</p>",
        "intent_type": "informational",
        "tags": ["seo", "anahtar kelime", "keyword research"],
        "seo_title": "Anahtar Kelime Araştırması Nasıl Yapılır? | Pixel360",
        "seo_description": "Etkili anahtar kelime araştırması rehberi. Araçlar, yöntemler, niyet analizi ve stratejik planlama.",
        "seo_slug": "anahtar-kelime-arastirmasi",
        "seo_focus_keyword": "anahtar kelime araştırması",
        "seo_secondary_keywords": ["keyword research", "seo anahtar kelime"],
        "status": "published"
    }
]

@router.post("/seed")
async def seed_database():
    """Seed database with initial content"""
    results = {"authors": 0, "categories": 0, "services": 0, "hubs": 0, "blog_posts": 0}
    
    # Seed Authors
    for author in SEED_AUTHORS:
        existing = await db.authors.find_one({"slug": author["slug"]})
        if not existing:
            author["created_at"] = datetime.utcnow()
            await db.authors.insert_one(author)
            results["authors"] += 1
    
    # Seed Categories
    category_map = {}
    for cat in SEED_CATEGORIES:
        existing = await db.categories.find_one({"slug": cat["slug"]})
        if not existing:
            cat["created_at"] = datetime.utcnow()
            await db.categories.insert_one(cat)
            results["categories"] += 1
            category_map[cat["slug"]] = cat["id"]
        else:
            category_map[cat["slug"]] = existing["id"]
    
    # Seed Services
    service_map = {}
    for svc in SEED_SERVICES:
        existing = await db.services.find_one({"seo_slug": svc["seo_slug"]})
        if not existing:
            svc["id"] = str(uuid.uuid4())
            svc["created_at"] = datetime.utcnow()
            svc["updated_at"] = datetime.utcnow()
            await db.services.insert_one(svc)
            results["services"] += 1
            service_map[svc["seo_slug"]] = svc["id"]
        else:
            service_map[svc["seo_slug"]] = existing["id"]
    
    # Seed Hubs
    hub_map = {}
    for hub in SEED_HUBS:
        existing = await db.hubs.find_one({"seo_slug": hub["seo_slug"]})
        if not existing:
            hub["id"] = str(uuid.uuid4())
            hub["created_at"] = datetime.utcnow()
            hub["updated_at"] = datetime.utcnow()
            # Link to service
            if hub["seo_slug"] == "google-ads":
                hub["featured_service_ids"] = [service_map.get("google-ads-yonetimi")]
            elif hub["seo_slug"] == "meta-ads":
                hub["featured_service_ids"] = [service_map.get("meta-ads-yonetimi")]
            elif hub["seo_slug"] == "seo":
                hub["featured_service_ids"] = [service_map.get("seo-hizmeti")]
            await db.hubs.insert_one(hub)
            results["hubs"] += 1
            hub_map[hub["seo_slug"]] = hub["id"]
        else:
            hub_map[hub["seo_slug"]] = existing["id"]
    
    # Seed Blog Posts
    for post in SEED_BLOG_POSTS:
        existing = await db.blog_posts.find_one({"seo_slug": post["seo_slug"]})
        if not existing:
            post["id"] = str(uuid.uuid4())
            post["created_at"] = datetime.utcnow()
            post["updated_at"] = datetime.utcnow()
            
            # Link to hub and service based on tags
            if "google ads" in post["tags"]:
                post["belongs_to_hub_id"] = hub_map.get("google-ads")
                post["supports_service_id"] = service_map.get("google-ads-yonetimi")
                post["category_id"] = category_map.get("google-ads")
            elif "facebook ads" in post["tags"] or "instagram ads" in post["tags"]:
                post["belongs_to_hub_id"] = hub_map.get("meta-ads")
                post["supports_service_id"] = service_map.get("meta-ads-yonetimi")
                post["category_id"] = category_map.get("meta-ads")
            elif "seo" in post["tags"] or "teknik seo" in post["tags"]:
                post["belongs_to_hub_id"] = hub_map.get("seo")
                post["supports_service_id"] = service_map.get("seo-hizmeti")
                post["category_id"] = category_map.get("seo")
            
            await db.blog_posts.insert_one(post)
            results["blog_posts"] += 1
    
    return {
        "message": "Database seeded successfully",
        "created": results
    }

@router.delete("/seed")
async def clear_seed_data():
    """Clear all seeded data (for development)"""
    await db.services.delete_many({})
    await db.blog_posts.delete_many({})
    await db.hubs.delete_many({})
    await db.authors.delete_many({})
    await db.categories.delete_many({})
    
    return {"message": "All content data cleared"}
