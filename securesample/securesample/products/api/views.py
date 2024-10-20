from . serializers import CategorySerializer, ShoeSerializer, ShoeImageSerializer
from rest_framework import viewsets
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from securesample.products.models import Category, Shoe, ShoeImage
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from securesample.products.filters import ShoeFilter

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ShoeFilter
    permission_classes = [IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)
    def destroy(self, request, *args, **kwargs):
        shoe = self.get_object()
        shoe.images.all().delete()  # Delete all associated images
        return super().destroy(request, *args, **kwargs)

class ShoeImageViewSet(viewsets.ModelViewSet):
    queryset = ShoeImage.objects.all()
    serializer_class = ShoeImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]  # Add filtering backend
    filterset_fields = ['shoe']  # Specify the field for filtering

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)
