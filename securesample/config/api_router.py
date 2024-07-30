from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from securesample.users.api.views import UserViewSet
from securesample.products.api.views import CategoryViewSet, ShoeViewSet, ShoeImageViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'shoes', ShoeViewSet, basename='shoe')
router.register(r'shoeimages', ShoeImageViewSet, basename='shoeimage')


app_name = "api"
urlpatterns = router.urls
