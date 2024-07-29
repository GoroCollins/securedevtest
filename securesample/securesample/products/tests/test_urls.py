import pytest
from django.urls import reverse
from django.test import Client

@pytest.mark.django_db
def test_categories_page():
    client = Client()
    response = client.get(reverse('category-list'))
    print(response)

    assert response.status_code == 200

@pytest.mark.django_db
def test_shoes_page():
    client = Client()
    response = client.get(reverse('shoe-list'))
    print(response)

    assert response.status_code == 200
