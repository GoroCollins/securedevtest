from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
# Create your models here.
    
class Category(models.Model):
    code = models.CharField(max_length=6, primary_key=True)
    description = models.CharField(max_length=20, null=False, blank=False)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='ccreator', related_query_name='ccreator', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cmodifier', related_query_name='cmodifier', blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'{self.description}'
    
    class Meta:
        verbose_name_plural = "Categories"

class Shoe(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='category', related_query_name='category', null=False, blank=False)
    name = models.CharField(max_length=20, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=False, blank=False)
    quantity = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='screator', related_query_name='screator', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='smodifier', related_query_name='smodifier', blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'{self.name}'

class ShoeImage(models.Model):
    shoe = models.ForeignKey(Shoe, related_name='images', on_delete=models.PROTECT, related_query_name='images', null=False, blank=False)
    image = models.ImageField(upload_to='uploads/images', null=False, blank=False)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='sicreator', related_query_name='sicreator', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='simodifier', related_query_name='simodifier', blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'Images for shoe:{self.shoe}'
    
    @property
    def image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return ''
    class Meta:
        verbose_name_plural = "Shoe Images"