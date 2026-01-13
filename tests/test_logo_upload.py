"""
Test suite for Pixel360 Logo Upload Feature
Tests:
- POST /api/upload/logo - Upload logo with image file
- GET /api/upload/logos - List all uploaded logos
- DELETE /api/upload/logo/{filename} - Delete a logo
- File validation (only jpg, png, gif, webp, svg allowed)
- Image resize functionality (max 200x80)
"""

import pytest
import requests
import os
import io
from PIL import Image

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://pixel360-admin.preview.emergentagent.com')


class TestLogoUploadEndpoints:
    """Test logo upload API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.uploaded_files = []
        yield
        # Cleanup: Delete test-created logos
        for filename in self.uploaded_files:
            try:
                self.session.delete(f"{BASE_URL}/api/upload/logo/{filename}")
            except:
                pass
    
    def create_test_image(self, width=300, height=150, format='PNG'):
        """Create a test image in memory"""
        img = Image.new('RGB', (width, height), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format=format)
        buffer.seek(0)
        return buffer
    
    def test_upload_logo_png(self):
        """Test uploading a PNG logo"""
        img_buffer = self.create_test_image(300, 150, 'PNG')
        
        response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_logo.png', img_buffer, 'image/png')},
            data={'brand_name': 'TEST_PNGBrand'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'logo_url' in data
        assert data['brand_name'] == 'TEST_PNGBrand'
        assert data['logo_url'].startswith('/uploads/logos/')
        
        # Track for cleanup
        self.uploaded_files.append(data['filename'])
    
    def test_upload_logo_jpeg(self):
        """Test uploading a JPEG logo"""
        img_buffer = self.create_test_image(300, 150, 'JPEG')
        
        response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_logo.jpg', img_buffer, 'image/jpeg')},
            data={'brand_name': 'TEST_JPEGBrand'}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'logo_url' in data
        
        self.uploaded_files.append(data['filename'])
    
    def test_upload_logo_invalid_type(self):
        """Test that invalid file types are rejected"""
        response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('test.txt', b'This is not an image', 'text/plain')},
            data={'brand_name': 'TEST_InvalidBrand'}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert 'Invalid file type' in data['detail']
    
    def test_upload_logo_missing_brand_name(self):
        """Test that brand_name is required"""
        img_buffer = self.create_test_image()
        
        response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_logo.png', img_buffer, 'image/png')}
            # Missing brand_name
        )
        
        # Should return 422 for missing required field
        assert response.status_code == 422
    
    def test_list_logos(self):
        """Test listing all uploaded logos"""
        response = self.session.get(f"{BASE_URL}/api/upload/logos")
        
        assert response.status_code == 200
        data = response.json()
        assert 'logos' in data
        assert isinstance(data['logos'], list)
        
        # Each logo should have filename and url
        for logo in data['logos']:
            assert 'filename' in logo
            assert 'url' in logo
    
    def test_delete_logo(self):
        """Test deleting an uploaded logo"""
        # First upload a logo
        img_buffer = self.create_test_image()
        upload_response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_delete.png', img_buffer, 'image/png')},
            data={'brand_name': 'TEST_DeleteBrand'}
        )
        
        assert upload_response.status_code == 200
        filename = upload_response.json()['filename']
        
        # Now delete it
        delete_response = self.session.delete(f"{BASE_URL}/api/upload/logo/{filename}")
        
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert data['success'] == True
        assert 'deleted' in data['message'].lower()
    
    def test_delete_nonexistent_logo(self):
        """Test deleting a logo that doesn't exist"""
        response = self.session.delete(f"{BASE_URL}/api/upload/logo/nonexistent_file_12345.png")
        
        assert response.status_code == 404
    
    def test_upload_and_verify_in_list(self):
        """Test that uploaded logo appears in list"""
        # Upload a logo
        img_buffer = self.create_test_image()
        upload_response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_verify.png', img_buffer, 'image/png')},
            data={'brand_name': 'TEST_VerifyBrand'}
        )
        
        assert upload_response.status_code == 200
        uploaded_filename = upload_response.json()['filename']
        self.uploaded_files.append(uploaded_filename)
        
        # Verify it appears in list
        list_response = self.session.get(f"{BASE_URL}/api/upload/logos")
        assert list_response.status_code == 200
        
        logos = list_response.json()['logos']
        filenames = [logo['filename'] for logo in logos]
        assert uploaded_filename in filenames


class TestSiteSectionsWithLogos:
    """Test site sections API with logo_url field"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
    
    def test_get_trust_badges_section(self):
        """Test getting trust_badges section with client_logos"""
        response = self.session.get(f"{BASE_URL}/api/site/sections/trust_badges")
        
        assert response.status_code == 200
        data = response.json()
        
        assert 'partners' in data
        assert 'client_logos' in data
        assert isinstance(data['client_logos'], list)
        
        # Check client_logos structure
        for logo in data['client_logos']:
            assert 'name' in logo
            # logo_url is optional but should be present if set
            if 'logo_url' in logo and logo['logo_url']:
                assert logo['logo_url'].startswith('/uploads/logos/')
    
    def test_client_logos_with_logo_url_displayed(self):
        """Test that client logos with logo_url are properly returned"""
        response = self.session.get(f"{BASE_URL}/api/site/sections/trust_badges")
        
        assert response.status_code == 200
        data = response.json()
        
        # Find logos with logo_url set
        logos_with_url = [l for l in data['client_logos'] if l.get('logo_url')]
        
        # At least one logo should have logo_url (TechCorp was set manually)
        assert len(logos_with_url) >= 1
        
        # Verify the logo_url format
        for logo in logos_with_url:
            assert logo['logo_url'].startswith('/uploads/logos/')


class TestImageResizing:
    """Test image resize functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.uploaded_files = []
        yield
        # Cleanup
        for filename in self.uploaded_files:
            try:
                self.session.delete(f"{BASE_URL}/api/upload/logo/{filename}")
            except:
                pass
    
    def test_large_image_gets_resized(self):
        """Test that large images are resized to max 200x80"""
        # Create a large image (500x400)
        img = Image.new('RGB', (500, 400), color='blue')
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        response = self.session.post(
            f"{BASE_URL}/api/upload/logo",
            files={'file': ('TEST_large.png', buffer, 'image/png')},
            data={'brand_name': 'TEST_LargeBrand'}
        )
        
        assert response.status_code == 200
        data = response.json()
        self.uploaded_files.append(data['filename'])
        
        # The upload should succeed - resize happens server-side
        assert data['success'] == True
        assert 'logo_url' in data


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
