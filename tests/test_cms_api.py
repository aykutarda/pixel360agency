"""
Pixel360 CMS API Tests
Tests for Services, Blog Posts, Hub Pages, and related endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Basic API health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API Root: {data}")


class TestServicesAPI:
    """Service endpoints tests"""
    
    def test_list_services(self):
        """Test listing all services"""
        response = requests.get(f"{BASE_URL}/api/cms/services")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} services")
        return data
    
    def test_list_published_services(self):
        """Test listing published services only"""
        response = requests.get(f"{BASE_URL}/api/cms/services", params={"status": "published"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned services should be published
        for service in data:
            assert service.get("status") == "published", f"Service {service.get('name')} is not published"
        print(f"Found {len(data)} published services")
        return data
    
    def test_get_service_by_slug_google_ads(self):
        """Test getting Google Ads service by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/services/by-slug/google-ads-yonetimi")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "google-ads-yonetimi"
        assert "name" in data
        assert "hero_h1" in data
        assert "hero_summary" in data
        print(f"Google Ads Service: {data.get('name')}")
        # Verify SEO fields
        assert "seo_title" in data
        assert "seo_description" in data
        return data
    
    def test_get_service_by_slug_meta_ads(self):
        """Test getting Meta Ads service by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/services/by-slug/meta-ads-yonetimi")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "meta-ads-yonetimi"
        print(f"Meta Ads Service: {data.get('name')}")
        return data
    
    def test_get_service_by_slug_seo(self):
        """Test getting SEO service by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/services/by-slug/seo-hizmeti")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "seo-hizmeti"
        print(f"SEO Service: {data.get('name')}")
        return data
    
    def test_get_nonexistent_service(self):
        """Test 404 for non-existent service slug"""
        response = requests.get(f"{BASE_URL}/api/cms/services/by-slug/nonexistent-service-slug")
        assert response.status_code == 404
        print("Correctly returned 404 for non-existent service")


class TestBlogAPI:
    """Blog post endpoints tests"""
    
    def test_list_blog_posts(self):
        """Test listing all blog posts"""
        response = requests.get(f"{BASE_URL}/api/cms/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} blog posts")
        return data
    
    def test_list_published_blog_posts(self):
        """Test listing published blog posts only"""
        response = requests.get(f"{BASE_URL}/api/cms/blog", params={"status": "published"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for post in data:
            assert post.get("status") == "published"
        print(f"Found {len(data)} published blog posts")
        return data
    
    def test_get_blog_post_google_ads_hatalari(self):
        """Test getting blog post by slug - google-ads-hatalari"""
        response = requests.get(f"{BASE_URL}/api/cms/blog/by-slug/google-ads-hatalari")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "google-ads-hatalari"
        assert "title" in data
        assert "content" in data
        assert "excerpt" in data
        print(f"Blog Post: {data.get('title')}")
        # Verify SEO fields
        assert "seo_title" in data
        assert "seo_description" in data
        return data
    
    def test_get_blog_post_kalite_puani(self):
        """Test getting blog post by slug - google-ads-kalite-puani"""
        response = requests.get(f"{BASE_URL}/api/cms/blog/by-slug/google-ads-kalite-puani")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "google-ads-kalite-puani"
        print(f"Blog Post: {data.get('title')}")
        return data
    
    def test_get_nonexistent_blog_post(self):
        """Test 404 for non-existent blog post slug"""
        response = requests.get(f"{BASE_URL}/api/cms/blog/by-slug/nonexistent-blog-slug")
        assert response.status_code == 404
        print("Correctly returned 404 for non-existent blog post")


class TestHubsAPI:
    """Hub page endpoints tests"""
    
    def test_list_hubs(self):
        """Test listing all hub pages"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} hub pages")
        return data
    
    def test_list_published_hubs(self):
        """Test listing published hub pages only"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs", params={"status": "published"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for hub in data:
            assert hub.get("status") == "published"
        print(f"Found {len(data)} published hub pages")
        return data
    
    def test_get_hub_google_ads(self):
        """Test getting Google Ads hub by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs/by-slug/google-ads")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "google-ads"
        assert "title" in data
        assert "intro" in data
        print(f"Hub Page: {data.get('title')}")
        # Verify SEO fields
        assert "seo_title" in data
        assert "seo_description" in data
        return data
    
    def test_get_hub_meta_ads(self):
        """Test getting Meta Ads hub by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs/by-slug/meta-ads")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "meta-ads"
        print(f"Hub Page: {data.get('title')}")
        return data
    
    def test_get_hub_seo(self):
        """Test getting SEO hub by slug"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs/by-slug/seo")
        assert response.status_code == 200
        data = response.json()
        assert data.get("seo_slug") == "seo"
        print(f"Hub Page: {data.get('title')}")
        return data
    
    def test_get_nonexistent_hub(self):
        """Test 404 for non-existent hub slug"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs/by-slug/nonexistent-hub-slug")
        assert response.status_code == 404
        print("Correctly returned 404 for non-existent hub")


class TestRedirectsAPI:
    """Redirect endpoints tests"""
    
    def test_list_redirects(self):
        """Test listing all redirects"""
        response = requests.get(f"{BASE_URL}/api/cms/redirects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} redirects")
        return data
    
    def test_check_redirect_nonexistent(self):
        """Test checking redirect for non-existent path"""
        response = requests.get(f"{BASE_URL}/api/cms/redirects/check", params={"path": "/some/random/path"})
        assert response.status_code == 200
        data = response.json()
        assert data.get("has_redirect") == False
        print("Correctly returned no redirect for random path")


class TestSettingsAPI:
    """Global settings endpoints tests"""
    
    def test_get_settings(self):
        """Test getting global settings"""
        response = requests.get(f"{BASE_URL}/api/cms/settings")
        assert response.status_code == 200
        data = response.json()
        assert "site_name" in data
        assert "organization" in data
        print(f"Site Name: {data.get('site_name')}")
        return data


class TestAuthorsAPI:
    """Authors endpoints tests"""
    
    def test_list_authors(self):
        """Test listing all authors"""
        response = requests.get(f"{BASE_URL}/api/cms/authors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} authors")
        return data


class TestCategoriesAPI:
    """Categories endpoints tests"""
    
    def test_list_categories(self):
        """Test listing all categories"""
        response = requests.get(f"{BASE_URL}/api/cms/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} categories")
        return data


class TestDataIntegrity:
    """Tests for data integrity and relationships"""
    
    def test_services_have_required_fields(self):
        """Verify all services have required fields for frontend"""
        response = requests.get(f"{BASE_URL}/api/cms/services", params={"status": "published"})
        assert response.status_code == 200
        services = response.json()
        
        required_fields = ["id", "name", "category", "hero_summary", "seo_slug"]
        for service in services:
            for field in required_fields:
                assert field in service, f"Service missing required field: {field}"
                assert service[field] is not None, f"Service has null {field}"
        print(f"All {len(services)} services have required fields")
    
    def test_blog_posts_have_required_fields(self):
        """Verify all blog posts have required fields for frontend"""
        response = requests.get(f"{BASE_URL}/api/cms/blog", params={"status": "published"})
        assert response.status_code == 200
        posts = response.json()
        
        required_fields = ["id", "title", "excerpt", "content", "seo_slug"]
        for post in posts:
            for field in required_fields:
                assert field in post, f"Blog post missing required field: {field}"
                assert post[field] is not None, f"Blog post has null {field}"
        print(f"All {len(posts)} blog posts have required fields")
    
    def test_hubs_have_required_fields(self):
        """Verify all hubs have required fields for frontend"""
        response = requests.get(f"{BASE_URL}/api/cms/hubs", params={"status": "published"})
        assert response.status_code == 200
        hubs = response.json()
        
        required_fields = ["id", "title", "intro", "seo_slug"]
        for hub in hubs:
            for field in required_fields:
                assert field in hub, f"Hub missing required field: {field}"
                assert hub[field] is not None, f"Hub has null {field}"
        print(f"All {len(hubs)} hubs have required fields")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
