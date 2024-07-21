# filters.py
from django_filters import rest_framework as filters
from .models import Shoe

class ShoeFilter(filters.FilterSet):
    class Meta:
        model = Shoe
        fields = {
            'category': ['exact'],
            # Add other fields if you want to support more filters
        }
