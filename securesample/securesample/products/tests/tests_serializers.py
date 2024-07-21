import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from securesample.products.models import Category, Shoe
from securesample.products.api.serializers import CategorySerializer, ShoeSerializer

User = get_user_model()

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
        image='/uploads/images/D89086_EXTRALARGE-682352451.jpg',
        name='Test Shoe',
        description='This is a test shoe.',
        price=50.00,
        quantity=10,
        created_by=user,
        modified_by=user
    )

@pytest.mark.django_db
def test_category_serializer(user, category):
    client = APIClient()
    serializer = CategorySerializer(instance=category)
    expected_data = {
        'code': 'wmn',
        'description': 'women',
        'created_by': 'test_user',
        'modified_by': 'test_user'
    }
    assert serializer.data == expected_data

@pytest.mark.django_db
def test_shoe_serializer(user, category, shoe):
    client = APIClient()
    serializer = ShoeSerializer(instance=shoe)
    expected_data = {
        'category_description': 'women',
        'image': '/backend/media/uploads/images/D89086_EXTRALARGE-682352451.jpg',
        'name': 'Test Shoe',
        'description': 'This is a test shoe.',
        'price': '50.00',
        'id': shoe.id,
        'quantity': 10,
        'category': 'wmn',
        'created_by': 'test_user',
        'modified_by': 'test_user'
    }
    assert serializer.data == expected_data
