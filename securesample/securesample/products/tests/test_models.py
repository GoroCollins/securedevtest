import pytest
from securesample.products.models import Category, Shoe
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='test_user', password='test_password')

@pytest.fixture
def category(user):
    return Category.objects.create(code='wmn', description='women', created_by=user)

@pytest.mark.django_db
def test_shoe_model(user, category):
    shoe = Shoe.objects.create(
        category=category,
        name='Test Shoe',
        description='This is a test shoe.',
        price=50.00,
        quantity=10,
        created_by=user
    )

    assert str(shoe) == 'Test Shoe'
    assert isinstance(shoe, Shoe)
    assert shoe.category == category
    assert shoe.name == 'Test Shoe'
    assert shoe.description == 'This is a test shoe.'
    assert shoe.price == 50.00
    assert shoe.quantity == 10
    assert shoe.created_by == user

@pytest.mark.django_db
def test_category_model(user):
    category = Category.objects.create(code='wmn', description='women', created_by=user)

    assert str(category) == 'women'
    assert isinstance(category, Category)
    assert category.code == 'wmn'
    assert category.description == 'women'
    assert category.created_by == user
