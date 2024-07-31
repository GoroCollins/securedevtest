import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
import io
from PIL import Image
from django.contrib.auth import get_user_model
from securesample.products.models import Category, Shoe, ShoeImage

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='test_user', password='test_password')

@pytest.fixture
def category(user):
    return Category.objects.create(code='wmn', description='women', created_by=user, modified_by=user)

@pytest.fixture
def shoe(user, category):
    return Shoe.objects.create(
        category=category,
        name='Test Shoe',
        description='This is a test shoe.',
        price=50.00,
        quantity=10,
        created_by=user,
        modified_by=user
    )

@pytest.fixture
def shoe_image(user, shoe):
    return ShoeImage.objects.create(
        shoe=shoe,
        image='/uploads/images/shoe1_Mb0tEg2.jpg',
        created_by=user,
        modified_by=user
    )

# Tests for CategoryViewSet

@pytest.mark.django_db
def test_create_category(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('api:category-list')
    data = {'code': 'men', 'description': 'men'}
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['code'] == 'men'

@pytest.mark.django_db
def test_retrieve_category(api_client, category):
    url = reverse('api:category-detail', args=[category.code])
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['code'] == category.code

@pytest.mark.django_db
def test_update_category(api_client, user, category):
    api_client.force_authenticate(user=user)
    url = reverse('api:category-detail', args=[category.code])
    data = {'code': 'wmn', 'description': 'updated description'}
    response = api_client.put(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['description'] == 'updated description'

@pytest.mark.django_db
def test_delete_category(api_client, user, category):
    api_client.force_authenticate(user=user)
    url = reverse('api:category-detail', args=[category.code])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Category.objects.count() == 0

@pytest.mark.django_db
def test_list_categories(api_client, category):
    url = reverse('api:category-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

@pytest.mark.django_db
def test_create_category_with_missing_fields(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('api:category-list')
    data = {'code': 'men'}
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST

# Tests for ShoeViewSet

@pytest.mark.django_db
def test_create_shoe(api_client, user, category):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoe-list')
    data = {
        'category': category.code,
        'name': 'New Shoe',
        'description': 'New shoe description',
        'price': 100.00,
        'quantity': 5
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['name'] == 'New Shoe'

@pytest.mark.django_db
def test_retrieve_shoe(api_client, shoe):
    url = reverse('api:shoe-detail', args=[shoe.id])
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == shoe.name

@pytest.mark.django_db
def test_update_shoe(api_client, user, shoe):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoe-detail', args=[shoe.id])
    data = {
        'category': shoe.category.code,
        'name': 'Updated Shoe',
        'description': 'Updated shoe description',
        'price': 150.00,
        'quantity': 8
    }
    response = api_client.put(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == 'Updated Shoe'

@pytest.mark.django_db
def test_delete_shoe(api_client, user, shoe):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoe-detail', args=[shoe.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Shoe.objects.count() == 0

@pytest.mark.django_db
def test_list_shoes(api_client, shoe):
    url = reverse('api:shoe-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

@pytest.mark.django_db
def test_create_shoe_with_invalid_price(api_client, user, category):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoe-list')
    data = {
        'category': category.code,
        'name': 'Invalid Shoe',
        'description': 'Invalid price',
        'price': 'invalid',
        'quantity': 5
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    
# Tests for ShoeImageViewSet

def create_image_file():
    file = io.BytesIO()
    image = Image.new('RGB', (100, 100))
    image.save(file, 'jpeg')
    file.name = 'test_image.jpg'
    file.seek(0)
    return file

@pytest.mark.django_db
def test_create_shoe_image(api_client, user, shoe):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoeimage-list')
    image_file = create_image_file()
    data = {
        'shoe': shoe.id,
        'image': image_file
    }
    response = api_client.post(url, data, format='multipart')
    
    # Print debug information
    print("Request URL:", url)
    print("Request Data:", data)
    print("Response Status Code:", response.status_code)
    print("Response Data:", response.data)
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['image'] is not None

@pytest.mark.django_db
def test_retrieve_shoe_image(api_client, shoe_image):
    url = reverse('api:shoeimage-detail', args=[shoe_image.id])
    response = api_client.get(url)
    print("Response Data:", response.data)  # Debugging line
    assert response.status_code == status.HTTP_200_OK
    assert response.data['image'] == shoe_image.image.url
@pytest.mark.django_db
def test_update_shoe_image(api_client, user, shoe_image):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoeimage-detail', args=[shoe_image.id])
    image_file1 = create_image_file()
    data = {
        'shoe': shoe_image.shoe.id,
        'image': image_file1
    }
    response = api_client.put(url, data, format='multipart')
    assert response.status_code == status.HTTP_200_OK
    # Check if the image was successfully updated (note: comparing file objects directly might not work as expected)
    assert 'test_image.jpg' in response.data['image']

@pytest.mark.django_db
def test_delete_shoe_image(api_client, user, shoe_image):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoeimage-detail', args=[shoe_image.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert ShoeImage.objects.count() == 0
    
@pytest.mark.django_db
def test_list_shoe_images(api_client, shoe_image):
    url = reverse('api:shoeimage-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

@pytest.mark.django_db
def test_create_shoe_image_with_invalid_file(api_client, user, shoe):
    api_client.force_authenticate(user=user)
    url = reverse('api:shoeimage-list')
    data = {
        'shoe': shoe.id,
        'image': 'invalid_image_file'
    }
    response = api_client.post(url, data, format='multipart')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
