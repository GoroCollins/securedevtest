from rest_framework import serializers
from securesample.products.models import Category, Shoe, ShoeImage

class CategorySerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    modified_by = serializers.ReadOnlyField(source='modified_by.username')
    class Meta:
        model = Category
        fields = ['code', 'description', 'created_by', 'modified_by']

class ShoeImageSerializer(serializers.ModelSerializer):
    shoe_description = serializers.CharField(source='shoe.name', read_only=True)
    class Meta:
        model = ShoeImage
        fields = ['image','created_by', 'modified_by', 'shoe', 'shoe_description', 'id']
class ShoeSerializer(serializers.ModelSerializer):
    category_description = serializers.CharField(source='category.description', read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    modified_by = serializers.ReadOnlyField(source='modified_by.username')
    images = ShoeImageSerializer(many=True, read_only=True)
    class Meta:
        model = Shoe
        fields = ['category_description', 'name', 'description', 'price', 'id', 'quantity', 'category', 'created_by', 'images', 'modified_by']
        

        
