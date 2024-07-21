from django.contrib import admin

# Register your models here.
from securesample.products.models import Shoe, Category, ShoeImage

admin.site.register(Shoe)
admin.site.register(Category)
admin.site.register(ShoeImage)