from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# ============================================
# GLOBAL SETTINGS
# ============================================

class OrganizationSchema(BaseModel):
    legal_name: str = "Pixel360 Dijital Pazarlama A.Ş."
    brand_name: str = "Pixel360"
    logo_url: Optional[str] = None
    url: str = "https://pixel360.com.tr"
    phone: str = "+90 532 123 45 67"
    email: str = "hello@pixel360.com.tr"
    address_street: str = "Büyükdere Cad. No:123"
    address_city: str = "İstanbul"
    address_region: str = "Levent"
    address_postal: str = "34394"
    address_country: str = "TR"
    social_profiles: List[str] = []

class SEODefaults(BaseModel):
    meta_title_template: str = "{{page_title}} | Pixel360"
    meta_description: str = "AI-Powered Growth Agency. Yapay zeka destekli dijital pazarlama çözümleri."
    robots: str = "index,follow"
    canonical_mode: str = "self"  # self | custom
    schema_org_enabled: bool = True

class GlobalSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_name: str = "Pixel360"
    site_tagline: str = "AI-Powered Growth Agency"
    primary_language: str = "tr"
    organization: OrganizationSchema = OrganizationSchema()
    seo_defaults: SEODefaults = SEODefaults()
    robots_txt: str = "User-agent: *\nAllow: /\nSitemap: /sitemap.xml"
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# MEASUREMENT & TRACKING SETTINGS
# ============================================

class GoogleAdsConversion(BaseModel):
    """Individual Google Ads conversion configuration"""
    name: str  # e.g., "lead_form_submit", "contact_click"
    conversion_id: Optional[str] = None  # AW-XXXXXXXXX
    conversion_label: Optional[str] = None  # Label for this specific conversion
    is_primary: bool = False  # Primary conversion for optimization

class MeasurementSettings(BaseModel):
    """All measurement and tracking configuration"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Google Tag Manager (Required)
    gtm_container_id: Optional[str] = None  # GTM-XXXXXXX
    gtm_enabled: bool = True
    
    # Google Analytics 4
    ga4_measurement_id: Optional[str] = None  # G-XXXXXXXXXX
    ga4_enabled: bool = True
    ga4_debug_mode: bool = False
    
    # Google Ads
    google_ads_id: Optional[str] = None  # AW-XXXXXXXXX (main account ID)
    google_ads_enabled: bool = True
    google_ads_conversions: List[GoogleAdsConversion] = [
        GoogleAdsConversion(name="lead_form_submit", is_primary=True),
        GoogleAdsConversion(name="contact_click"),
        GoogleAdsConversion(name="service_cta_click"),
    ]
    
    # Meta (Facebook) Pixel
    meta_pixel_id: Optional[str] = None  # 15-16 digit number
    meta_pixel_enabled: bool = True
    
    # Microsoft Clarity (Optional - UX Analytics)
    clarity_project_id: Optional[str] = None  # Project ID from Clarity
    clarity_enabled: bool = False
    
    # Hotjar (Optional - UX Analytics)
    hotjar_site_id: Optional[str] = None  # Site ID from Hotjar
    hotjar_enabled: bool = False
    
    # Event Configuration
    scroll_depth_thresholds: List[int] = [25, 50, 75]  # Percentages
    time_on_page_thresholds: List[int] = [30, 60]  # Seconds
    
    # Timestamps
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = None


# ============================================
# SITE SETTINGS (READ-ONLY MODE, etc.)
# ============================================

class SiteSettings(BaseModel):
    """Global site settings including maintenance mode"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Read-Only / Maintenance Mode
    read_only_mode: bool = False
    read_only_message: str = "Site şu anda bakım modunda. İçerik yayınlanamaz."
    read_only_started_at: Optional[datetime] = None
    read_only_started_by: Optional[str] = None
    
    # Timestamps
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = None

# ============================================
# SEO COMMON FIELDS (Mixin)
# ============================================

class FAQItem(BaseModel):
    question: str
    answer: str

class SEOFields(BaseModel):
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_slug: str
    seo_canonical_mode: str = "self"  # self | custom
    seo_canonical_url: Optional[str] = None
    seo_robots: str = "index,follow"
    seo_focus_keyword: Optional[str] = None
    seo_secondary_keywords: List[str] = []
    seo_breadcrumb_enabled: bool = True
    seo_schema_type: str = "WebPage"  # WebPage | Service | Article | CollectionPage
    seo_schema_faq_enabled: bool = False
    seo_schema_faq_items: List[FAQItem] = []

class SocialFields(BaseModel):
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card_type: str = "summary_large_image"

class ContentGovernance(BaseModel):
    status: str = "draft"  # draft | published
    published_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    author_id: Optional[str] = None

# ============================================
# SERVICES
# ============================================

class ProcessStep(BaseModel):
    title: str
    description: str
    icon: Optional[str] = None

class ProofItem(BaseModel):
    type: str  # testimonial | logo | case
    reference_id: Optional[str] = None
    content: Optional[str] = None

class ServiceCreate(BaseModel):
    name: str
    category: str  # performance | creative | strategy | seo | social | production
    hero_h1: str
    hero_summary: str
    primary_cta_label: str = "Teklif Al"
    primary_cta_url: str = "#contact"
    secondary_cta_label: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    problem_block: str
    solution_block: str
    process_steps: List[ProcessStep] = []
    deliverables: List[str] = []
    kpi_outcomes: List[dict] = []  # {metric_name, value, note}
    proof_items: List[ProofItem] = []
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_slug: str
    seo_focus_keyword: Optional[str] = None
    seo_secondary_keywords: List[str] = []
    seo_robots: str = "index,follow"
    seo_schema_faq_enabled: bool = False
    seo_schema_faq_items: List[FAQItem] = []
    # Linking
    primary_hub_id: Optional[str] = None
    supporting_post_ids: List[str] = []
    related_service_ids: List[str] = []
    # Social
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    # Status
    status: str = "draft"

class Service(ServiceCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    # Change Log (Light)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    last_change_summary: Optional[str] = None  # e.g., "SEO title, description güncellendi"

# ============================================
# BLOG POSTS
# ============================================

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    cover_image: Optional[str] = None
    cover_image_alt: Optional[str] = None
    content: str  # HTML or Markdown
    author_id: Optional[str] = None
    category_id: Optional[str] = None
    tags: List[str] = []
    # Intent & Linking
    intent_type: str = "informational"  # informational | commercial | transactional | navigational
    supports_service_id: Optional[str] = None  # Which service this post supports
    belongs_to_hub_id: Optional[str] = None
    recommended_internal_links: List[str] = []  # IDs of related content
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_slug: str
    seo_focus_keyword: Optional[str] = None
    seo_secondary_keywords: List[str] = []
    seo_robots: str = "index,follow"
    seo_schema_faq_enabled: bool = False
    seo_schema_faq_items: List[FAQItem] = []
    # Social
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    # Status
    status: str = "draft"

class BlogPost(BlogPostCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    # Change Log (Light)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    last_change_summary: Optional[str] = None

# ============================================
# HUB PAGES (Topics)
# ============================================

class HubPageCreate(BaseModel):
    title: str
    intro: str  # Rich text intro
    primary_keyword: str
    secondary_keywords: List[str] = []
    # Aggregation
    featured_service_ids: List[str] = []
    featured_post_ids: List[str] = []
    auto_pull_categories: List[str] = []  # Auto-pull posts from these categories
    auto_pull_tags: List[str] = []
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_slug: str
    seo_focus_keyword: Optional[str] = None
    seo_secondary_keywords: List[str] = []
    seo_robots: str = "index,follow"
    seo_schema_faq_enabled: bool = False
    seo_schema_faq_items: List[FAQItem] = []
    # Social
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    # Status
    status: str = "draft"

class HubPage(HubPageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# REDIRECTS
# ============================================

class RedirectCreate(BaseModel):
    from_path: str
    to_path: str
    status_code: int = 301  # 301 | 302
    is_regex: bool = False
    is_active: bool = True
    note: Optional[str] = None

class Redirect(RedirectCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# AUTHORS
# ============================================

class AuthorCreate(BaseModel):
    name: str
    slug: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[str] = None
    social_links: List[dict] = []  # {platform, url}

class Author(AuthorCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# CATEGORIES
# ============================================

class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None

class Category(CategoryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# SITE SECTIONS (CMS for website content)
# ============================================

class SiteSectionCreate(BaseModel):
    key: str  # header, hero, stats, footer, trust_badges
    payload: dict  # JSON content
    version: int = 1

class SiteSection(SiteSectionCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = None

# ============================================
# ADMIN AUTH
# ============================================

class AdminUserCreate(BaseModel):
    email: str
    password: str
    name: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    hashed_password: str
    is_active: bool = True
    must_change_password: bool = True  # Force password change on first login
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class AdminPasswordChange(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    must_change_password: bool = False

class TokenData(BaseModel):
    email: Optional[str] = None

# ============================================
# LOGIN ATTEMPT TRACKING
# ============================================

class LoginAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    ip_address: Optional[str] = None
    success: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# PREVIEW TOKEN
# ============================================

class PreviewToken(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_type: str  # service, blog, hub
    content_id: str
    token: str
    expires_at: datetime
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
