import pytest
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from securesample.products.models import Category, Shoe, ShoeImage
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='test_user', password='test_password')

@pytest.fixture
def category(user):
    return Category.objects.create(code='wmn', description='women', created_by=user)

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

@pytest.mark.django_db
def test_shoe_image_model(user, shoe):
    image_path = 'uploads/images/shoe1_Mb0tEg2.jpg'
    shoe_image = ShoeImage.objects.create(
        shoe=shoe,
        image=image_path,
        created_by=user
    )

    assert str(shoe_image) == f'Images for shoe:{shoe}'
    assert isinstance(shoe_image, ShoeImage)
    assert shoe_image.shoe == shoe
    assert shoe_image.image == image_path
    assert shoe_image.created_by == user

@pytest.mark.django_db
def test_category_code_uniqueness(user):
    Category.objects.create(code='uni', description='Unique Category', created_by=user)
    with pytest.raises(ValidationError):
        duplicate_category = Category(code='uni', description='Duplicate Category', created_by=user)
        duplicate_category.full_clean()

@pytest.mark.django_db
def test_shoe_negative_price(user, category):
    with pytest.raises(ValidationError):
        invalid_shoe = Shoe(
            category=category,
            name='Invalid Shoe',
            description='This shoe has a negative price.',
            price=-10.00,
            quantity=10,
            created_by=user
        )
        invalid_shoe.full_clean()

@pytest.mark.django_db
def test_shoe_image_without_image(user, shoe):
    with pytest.raises(ValidationError):
        invalid_shoe_image = ShoeImage(
            shoe=shoe,
            image=None,
            created_by=user
        )
        invalid_shoe_image.full_clean()

@pytest.mark.django_db
def test_category_default_fields(user):
    category = Category.objects.create(code='new', description='New Category', created_by=user)
    assert category.created_at is not None
    assert category.modified_at is not None

@pytest.mark.django_db
def test_shoe_default_fields(user, category):
    shoe = Shoe.objects.create(
        category=category,
        name='Default Shoe',
        description='Shoe with default fields',
        price=100.00,
        quantity=5,
        created_by=user
    )
    assert shoe.created_at is not None
    assert shoe.modified_at is not None
    
@pytest.mark.django_db
def test_update_shoe(user, shoe):
    shoe.name = 'Updated Shoe'
    shoe.description = 'Updated shoe description'
    shoe.price = 60.00
    shoe.save()

    updated_shoe = Shoe.objects.get(id=shoe.id)
    assert updated_shoe.name == 'Updated Shoe'
    assert updated_shoe.description == 'Updated shoe description'
    assert updated_shoe.price == 60.00

@pytest.mark.django_db
def test_delete_shoe(user, shoe):
    shoe_id = shoe.id
    shoe.delete()

    with pytest.raises(Shoe.DoesNotExist):
        Shoe.objects.get(id=shoe_id)

@pytest.mark.django_db
def test_category_shoe_relation(user, category):
    shoe = Shoe.objects.create(
        category=category,
        name='Related Shoe',
        description='Shoe related to category.',
        price=70.00,
        quantity=15,
        created_by=user
    )
    
    assert shoe.category == category
    assert category.category.filter(id=shoe.id).exists()

@pytest.mark.django_db
def test_shoeimage_shoe_relation(user, shoe):
    shoe_image = ShoeImage.objects.create(
        shoe=shoe,
        image=SimpleUploadedFile(name='related_image.jpg', content=b'', content_type='image/jpeg'),
        created_by=user
    )

    assert shoe_image.shoe == shoe
    assert shoe.images.filter(id=shoe_image.id).exists()