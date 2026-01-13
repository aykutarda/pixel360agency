import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Head Component
 * Renders all SEO meta tags, Open Graph, Twitter Cards, and Schema.org
 */
const SEOHead = ({
  // Basic SEO
  title,
  description,
  canonical,
  robots = 'index,follow',
  
  // Open Graph
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  
  // Twitter
  twitterCard = 'summary_large_image',
  
  // Schema
  schema,
  
  // Additional
  keywords = [],
  author,
  publishedTime,
  modifiedTime
}) => {
  const siteTitle = 'Pixel360';
  const siteUrl = 'https://pixel360.com.tr';
  const defaultImage = `${siteUrl}/og-image.jpg`;
  
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - AI-Powered Growth Agency`;
  const metaDescription = description || 'Yapay zeka destekli dijital pazarlama çözümleri. Google Ads, Meta Ads, SEO ve daha fazlası.';
  const metaImage = ogImage || defaultImage;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Article Meta (for blog posts) */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Helper function to generate Organization schema
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pixel360",
  "alternateName": "Pixel360 Dijital Pazarlama",
  "url": "https://pixel360.com.tr",
  "logo": "https://pixel360.com.tr/logo.png",
  "description": "AI-Powered Growth Agency. Yapay zeka destekli dijital pazarlama çözümleri.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Büyükdere Cad. No:123",
    "addressLocality": "İstanbul",
    "addressRegion": "Levent",
    "postalCode": "34394",
    "addressCountry": "TR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-532-123-4567",
    "contactType": "customer service",
    "availableLanguage": "Turkish"
  },
  "sameAs": [
    "https://www.linkedin.com/company/pixel360",
    "https://www.instagram.com/pixel360"
  ]
});

// Helper function to generate Service schema
export const generateServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.seo_description || service.hero_summary,
  "provider": {
    "@type": "Organization",
    "name": "Pixel360"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Turkey"
  },
  "serviceType": service.category
});

// Helper function to generate Article schema
export const generateArticleSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.seo_description || post.excerpt,
  "author": {
    "@type": "Organization",
    "name": "Pixel360"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Pixel360",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pixel360.com.tr/logo.png"
    }
  },
  "datePublished": post.created_at,
  "dateModified": post.updated_at,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://pixel360.com.tr/blog/${post.seo_slug}`
  }
});

// Helper function to generate FAQ schema
export const generateFAQSchema = (faqItems) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

// Helper function to generate BreadcrumbList schema
export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export default SEOHead;
