# Pixel360 - AI-Powered Growth Agency Website

## Project Overview
Premium dijital pazarlama ajansı web sitesi. SEO-uyumlu, headless CMS destekli, çok sayfalı mimari.

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, react-router-dom, react-helmet-async
- **Backend**: FastAPI, Motor (async MongoDB), JWT Auth
- **Database**: MongoDB
- **Hosting**: Emergent Platform

## Current Status: Phase 2.6 Complete - Admin Panel Enhancements ✅

### Completed Features

#### Phase 1: Backend CMS (Complete ✅)
- [x] Pydantic models for Services, Blog Posts, Hub Pages, Global Settings
- [x] CRUD API endpoints for all content types (`/api/cms/*`)
- [x] Dynamic sitemap.xml and robots.txt generation (`/api/seo/*`)
- [x] Database seeding endpoint (`/api/cms/seed`)
- [x] Automatic 301 redirects on slug changes (only for published content)

#### Phase 2: Frontend Integration (Complete ✅)
- [x] Multi-page routing setup (`App.js`)
- [x] Dynamic SEO meta tags with `react-helmet-async`
- [x] API integration via `frontend/src/api/cms.js`
- [x] Services component fetches from backend API
- [x] ServicePage, BlogPage, HubPage with dynamic content

#### Phase 2.1: Admin Panel (Complete ✅)
- [x] **JWT Authentication**
  - Bootstrap admin from env vars (`BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`)
  - Force password change on first login
  - Rate limiting: 5 failed attempts = 10 min lockout
- [x] **Admin Dashboard** at `/admin`
  - Stats overview (services, blog, hubs, redirects count)
  - Quick action buttons
  - Recent activity feed
- [x] **Content Management**
  - Services list & edit pages
  - Blog posts list page
  - Hubs list page
  - All with draft/published status

#### Phase 2.2: Full CMS Control (Complete ✅) - January 13, 2026
- [x] **All 11 Site Sections Manageable via Admin**
  - Header, Hero, Stats, Trust Badges, Why Us, AI Capabilities, Framework
  - Portfolio/Başarı Hikayeleri, Testimonials/Müşteri Yorumları, Contact/İletişim, Footer
- [x] **All Frontend Components Dynamic**
- [x] **Deleted obsolete mock.js file**

#### Phase 2.5: Measurement & Conversion Foundation (Complete ✅) - January 13, 2026
- [x] **Backend Measurement Settings API** (`/api/measurement/*`)
  - `GET /api/measurement/config` - Public config for frontend
  - `GET /api/measurement/settings` - Admin settings (auth required)
  - `PUT /api/measurement/settings` - Update settings (auth required)
  - `GET /api/measurement/test-config` - Test configuration status
- [x] **Admin Measurement Settings Page** (`/admin/measurement`)
  - Google Tag Manager (GTM) - Container ID placeholder
  - Google Analytics 4 (GA4) - Measurement ID placeholder
  - Google Ads - Account ID & Conversion Labels
  - Meta (Facebook) Pixel - Pixel ID placeholder
  - Microsoft Clarity - Project ID placeholder (optional)
  - Hotjar - Site ID placeholder (optional)
  - Event configuration (scroll depth, time on page thresholds)
  - Event Reference table (lead_form_submit, contact_click, etc.)
- [x] **Frontend Measurement Utilities** (`/utils/measurement.js`)
  - `initMeasurement()` - Load config from backend
  - `pushToDataLayer()` - GTM dataLayer integration
  - `trackPageView()`, `trackScrollDepth()`, `trackTimeOnPage()` - Page events
  - `trackLeadFormSubmit()` - PRIMARY CONVERSION
  - `trackContactClick()`, `trackServiceCtaClick()`, `trackBlogToServiceClick()` - Secondary conversions
  - `getPageType()`, `getContentId()`, `getDeviceType()`, `getTrafficSource()` - Context helpers
- [x] **GTM Script Loader** (`/components/GTMScript.jsx`)
  - Dynamic GTM loading based on backend config
- [x] **Contact Component Event Tracking**
  - Form submit tracks `lead_form_submit`
  - Phone/WhatsApp/Email clicks track `contact_click`

#### Phase 2.6: Admin Panel Enhancements (Complete ✅) - January 13, 2026
- [x] **1️⃣ Content Intent Badges**
  - Blog listesinde 🟢 Informational, 🟡 Commercial, 🔴 Transactional badge'leri
  - Services listesinde kategori badge'leri (Performance, SEO, Creative, etc.)
  - Her badge'de ilgili ikon ve renk kodlaması
- [x] **2️⃣ Measurement Status Badges**
  - Measurement sayfası üstünde 6 durum kartı (GTM, GA4, Google Ads, Meta Pixel, Clarity, Hotjar)
  - Aktif/Pasif/Yapılandırılmadı durumları canlı olarak gösteriliyor
  - Her kart için pulse animasyonu ve durum rengi
- [x] **3️⃣ Read-Only Mode (Bakım Modu)**
  - Sidebar'da toggle butonu
  - Aktifken içerik yayınlanamaz (publish engellenir)
  - Tüm sayfalarda kırmızı uyarı banner'ı
  - Backend CMS routes read-only check ekli
- [x] **4️⃣ Publish Guard (SEO Validation)** - ENTEGRE EDİLDİ
  - ServiceEditPage ve BlogEditPage'e entegre
  - Yayınlama öncesi SEO kontrol modalı
  - Required alanlar: SEO Title (30-60 char), Description (120-160 char), Slug, Focus Keyword
  - Hatalar kırmızı, uyarılar sarı renkte ayrı gösteriliyor
  - SEO sorunları edit sayfasında da kırmızı banner olarak gösteriliyor
- [x] **5️⃣ Change Log (Light)** - ENTEGRE EDİLDİ
  - ServiceEditPage ve BlogEditPage sidebar'ına entegre
  - Son güncelleme tarihi, güncelleyen kişi
  - Oluşturma tarihi ve kişisi
  - Değişen alanların özeti (last_change_summary)
- [x] **6️⃣ Internal Link Health** - ENTEGRE EDİLDİ
  - BlogEditPage sidebar'ına entegre
  - Hub ve Service bağlantı durumu ✓ / ⚠️
  - SEO sağlık skoru (%)
  - Hızlı bağlantı dropdown'ları

### Database Content
- 3 Services: Google Ads Yönetimi, Meta Ads Yönetimi, SEO Hizmeti
- 6 Blog Posts: Various informational articles
- 3 Hub Pages: Google Ads, Meta Ads, SEO topic centers
- Site Sections: header, hero, stats, trust_badges, why_us, ai_capabilities, framework, portfolio, testimonials, contact, footer (all 11 sections)

## Admin Panel Access
- **URL**: `/admin`
- **Email**: `admin@pixel360.com.tr`
- **Password**: `NewSecurePass2024!` (changed from initial bootstrap)

## API Endpoints

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/bootstrap` | Create admin from env vars |
| POST | `/api/auth/change-password` | Change password (auth required) |
| GET | `/api/auth/me` | Get current user info |

### Site Sections (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/site/sections` | Get all sections (public) |
| GET | `/api/site/sections/{key}` | Get specific section |
| PUT | `/api/site/sections/{key}` | Update section (auth required) |

### Site Settings (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/status` | Get read-only mode status (public) |
| GET | `/api/settings/settings` | Get full settings (auth) |
| PUT | `/api/settings/settings` | Update settings (auth) |
| POST | `/api/settings/toggle-read-only` | Quick toggle (auth) |

### CMS Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cms/services` | List all services |
| GET | `/api/cms/services/by-slug/{slug}` | Get service by slug |
| POST/PUT/DELETE | `/api/cms/services` | CRUD operations |
| GET | `/api/cms/blog` | List all blog posts |
| GET | `/api/cms/hubs` | List all hub pages |
| GET | `/api/cms/redirects` | List redirects |

## File Structure
```
/app
├── backend/
│   ├── server.py
│   ├── models.py
│   └── routes/
│       ├── auth.py        # JWT auth with rate limiting
│       ├── cms.py         # Content CRUD
│       ├── site_sections.py # Site content API
│       ├── seo.py
│       └── seed.py
└── frontend/
    └── src/
        ├── App.js
        ├── admin/           # NEW: Admin panel
        │   ├── api.js
        │   ├── AuthContext.jsx
        │   ├── components/
        │   │   └── AdminLayout.jsx
        │   └── pages/
        │       ├── LoginPage.jsx
        │       ├── ChangePasswordPage.jsx
        │       ├── DashboardPage.jsx
        │       ├── ServicesListPage.jsx
        │       ├── ServiceEditPage.jsx
        │       ├── BlogListPage.jsx
        │       ├── HubsListPage.jsx
        │       └── SiteContentPage.jsx
        ├── components/
        │   ├── Header.jsx   # Dynamic from API
        │   ├── Hero.jsx     # Dynamic from API
        │   └── Services.jsx # Dynamic from API
        └── pages/
            ├── HomePage.jsx
            ├── ServicePage.jsx
            ├── BlogPage.jsx
            └── HubPage.jsx
```

## Test Reports
- `/app/test_reports/iteration_1.json` - Phase 2 tests (all passed)
- `/app/test_reports/iteration_2.json` - Phase 2.1 tests (22/22 passed, 100%)
- `/app/tests/test_admin_auth.py` - Admin auth test suite

## Upcoming Tasks (P1)

### Phase 3: Enhanced Case Studies
- [ ] Case study data model with Challenge → Strategy → Execution → Results
- [ ] Case study CRUD API endpoints
- [ ] `/case-studies/:slug` dynamic route
- [ ] Case study editor in admin panel

### Phase 3.5: Ads Integration
- [ ] Google Ads campaign setup
- [ ] Meta Ads campaign setup
- [ ] Conversion tracking verification in GTM
- [ ] Landing page optimization for ad campaigns

### Future Tasks (P2)
- [ ] Interactive lead-gen tools (Growth Calculator, AI SEO Audit)
- [ ] Enhanced CMS (user roles, versioning)
- [ ] Content preview with draft token
- [ ] Image upload/management system
- [ ] Server-side GTM (Phase 3 Measurement)
- [ ] Meta Conversions API (CAPI)

---
**Last Updated**: January 13, 2026
**Status**: Phase 2.5 Complete - Measurement & Conversion Foundation

## Measurement Setup Instructions

### Required Tracking IDs (Admin Panel > Measurement)
1. **GTM Container ID** (GTM-XXXXXXX) - Google Tag Manager > Admin > Container ID
2. **GA4 Measurement ID** (G-XXXXXXXXXX) - GA4 > Admin > Data Streams
3. **Google Ads ID** (AW-XXXXXXXXX) - Google Ads > Tools > Conversions
4. **Meta Pixel ID** - Meta Events Manager > Data Sources

### GTM Tags to Configure
After entering IDs in admin panel, create these tags in GTM:
1. GA4 Configuration Tag
2. GA4 Event Tags (lead_form_submit, contact_click, scroll_depth, time_on_page)
3. Google Ads Conversion Tag (for lead_form_submit - PRIMARY)
4. Meta Pixel Base Tag + Lead Event
