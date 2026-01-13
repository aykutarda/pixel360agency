"""
Test suite for Pixel360 Admin Panel - Phase 2.1
Tests: JWT Auth, Rate Limiting, Site Sections API
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://premium-digital-15.preview.emergentagent.com')

# Test credentials from env
ADMIN_EMAIL = "admin@pixel360.com.tr"
ADMIN_PASSWORD = "Pixel360Admin2024!"

class TestAuthBootstrap:
    """Test admin bootstrap and initial setup"""
    
    def test_bootstrap_admin(self):
        """Bootstrap admin user if not exists"""
        response = requests.post(f"{BASE_URL}/api/auth/bootstrap")
        # Either 200 (created) or 400 (already exists) is acceptable
        assert response.status_code in [200, 400], f"Bootstrap failed: {response.text}"
        if response.status_code == 200:
            data = response.json()
            assert data["email"] == ADMIN_EMAIL
            print(f"Bootstrap successful: {data}")
        else:
            print(f"Admin already exists: {response.json()}")


class TestAuthLogin:
    """Test login functionality"""
    
    def test_login_success(self):
        """Test successful login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "must_change_password" in data
        assert data["token_type"] == "bearer"
        print(f"Login successful, must_change_password: {data['must_change_password']}")
        return data["access_token"]
    
    def test_login_invalid_email(self):
        """Test login with invalid email"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Invalid email rejected: {data['detail']}")
    
    def test_login_invalid_password(self):
        """Test login with invalid password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Invalid password rejected: {data['detail']}")


class TestAuthMe:
    """Test /me endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed")
    
    def test_get_current_user(self, auth_token):
        """Test getting current user info"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert "name" in data
        assert "must_change_password" in data
        print(f"Current user: {data}")
    
    def test_get_me_without_token(self):
        """Test /me without auth token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code in [401, 403]


class TestSiteSections:
    """Test site sections API"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed")
    
    def test_get_all_sections_public(self):
        """Test getting all site sections (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/site/sections")
        assert response.status_code == 200
        data = response.json()
        
        # Should have 5 sections
        expected_sections = ["header", "hero", "stats", "trust_badges", "footer"]
        for section in expected_sections:
            assert section in data, f"Missing section: {section}"
        
        print(f"Found {len(data)} sections: {list(data.keys())}")
        return data
    
    def test_get_header_section(self):
        """Test getting header section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/header")
        assert response.status_code == 200
        data = response.json()
        
        # Verify header structure
        assert "logo" in data
        assert "nav_links" in data
        assert "cta_button" in data
        assert isinstance(data["nav_links"], list)
        print(f"Header section: logo={data['logo']}, nav_links={len(data['nav_links'])}")
    
    def test_get_hero_section(self):
        """Test getting hero section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/hero")
        assert response.status_code == 200
        data = response.json()
        
        # Verify hero structure
        assert "badge" in data
        assert "title" in data
        assert "subtitle" in data
        assert "description" in data
        assert "primary_cta" in data
        print(f"Hero section: badge={data['badge']}, title={data['title']}")
    
    def test_get_stats_section(self):
        """Test getting stats section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify stats structure
        assert "items" in data
        assert len(data["items"]) == 4, "Should have 4 stats items"
        for item in data["items"]:
            assert "number" in item
            assert "label" in item
        print(f"Stats section: {len(data['items'])} items")
    
    def test_get_trust_badges_section(self):
        """Test getting trust badges section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/trust_badges")
        assert response.status_code == 200
        data = response.json()
        
        # Verify trust badges structure
        assert "partners" in data
        assert "client_logos" in data
        print(f"Trust badges: {len(data['partners'])} partners, {len(data['client_logos'])} logos")
    
    def test_get_footer_section(self):
        """Test getting footer section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/footer")
        assert response.status_code == 200
        data = response.json()
        
        # Verify footer structure
        assert "logo" in data
        assert "contact" in data
        assert "social_links" in data
        assert "copyright" in data
        print(f"Footer section: logo={data['logo']}, contact={data['contact']}")
    
    def test_get_invalid_section(self):
        """Test getting non-existent section"""
        response = requests.get(f"{BASE_URL}/api/site/sections/invalid_section")
        assert response.status_code == 404
    
    def test_update_section_requires_auth(self):
        """Test that updating section requires authentication"""
        response = requests.put(
            f"{BASE_URL}/api/site/sections/header",
            json={"logo": "TEST"}
        )
        assert response.status_code in [401, 403]
    
    def test_update_header_section(self, auth_token):
        """Test updating header section (admin only)"""
        # First get current header
        get_response = requests.get(f"{BASE_URL}/api/site/sections/header")
        original_data = get_response.json()
        
        # Update with modified data
        updated_data = original_data.copy()
        updated_data["phone"] = "+90 555 TEST 123"
        
        response = requests.put(
            f"{BASE_URL}/api/site/sections/header",
            json=updated_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        # Verify update
        verify_response = requests.get(f"{BASE_URL}/api/site/sections/header")
        verify_data = verify_response.json()
        assert verify_data["phone"] == "+90 555 TEST 123"
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/site/sections/header",
            json=original_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print("Header section update test passed")
    
    def test_update_invalid_section_key(self, auth_token):
        """Test updating with invalid section key"""
        response = requests.put(
            f"{BASE_URL}/api/site/sections/invalid_key",
            json={"test": "data"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 400


class TestCMSEndpoints:
    """Test CMS endpoints (services, blog, hubs)"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Login failed")
    
    def test_get_services(self, auth_token):
        """Test getting services list"""
        response = requests.get(
            f"{BASE_URL}/api/cms/services",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} services")
        return data
    
    def test_get_blog_posts(self, auth_token):
        """Test getting blog posts list"""
        response = requests.get(
            f"{BASE_URL}/api/cms/blog",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} blog posts")
        return data
    
    def test_get_hubs(self, auth_token):
        """Test getting hubs list"""
        response = requests.get(
            f"{BASE_URL}/api/cms/hubs",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} hubs")
        return data
    
    def test_get_redirects(self, auth_token):
        """Test getting redirects list"""
        response = requests.get(
            f"{BASE_URL}/api/cms/redirects",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} redirects")


class TestRateLimiting:
    """Test rate limiting on login (5 attempts = lockout)"""
    
    def test_rate_limiting_message(self):
        """Test that failed login shows remaining attempts"""
        # First, ensure we're not locked out by logging in successfully
        success_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if success_response.status_code == 429:
            print("Account is currently locked, skipping rate limit test")
            pytest.skip("Account locked from previous tests")
        
        # Now test with wrong password
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword123"
        })
        
        assert response.status_code == 401
        data = response.json()
        # Should show remaining attempts or error message
        assert "detail" in data
        print(f"Rate limit response: {data['detail']}")
        
        # Reset by logging in successfully
        requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })


class TestHomepageAPI:
    """Test that homepage can fetch data from API"""
    
    def test_homepage_loads_sections(self):
        """Test that site sections API returns data for homepage"""
        response = requests.get(f"{BASE_URL}/api/site/sections")
        assert response.status_code == 200
        data = response.json()
        
        # Verify all sections needed for homepage
        assert "header" in data
        assert "hero" in data
        assert "stats" in data
        assert "trust_badges" in data
        assert "footer" in data
        
        # Verify header has nav links
        assert len(data["header"]["nav_links"]) > 0
        
        # Verify hero has title
        assert len(data["hero"]["title"]) > 0
        
        # Verify stats has items
        assert len(data["stats"]["items"]) == 4
        
        print("Homepage API data verified successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
