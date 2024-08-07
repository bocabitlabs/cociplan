from django.db import models

from menus.models.products import Product
from menus.models.recipes import Recipe


# https://pypi.org/project/django-types/
# Create your models here.
class Ingredient(models.Model):
    id = models.BigAutoField(primary_key=True)
    quantity: models.CharField = models.CharField(max_length=200)

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    product_id: int
    product = models.ForeignKey["Product", Product](
        Product, on_delete=models.RESTRICT, related_name="ingredients"
    )

    recipe_id: int
    recipe = models.ForeignKey["Recipe", Recipe](
        Recipe, on_delete=models.CASCADE, related_name="ingredients"
    )

    class Meta:
        ordering = ["quantity"]
        verbose_name = "Ingredient"
        verbose_name_plural = "Ingredients"

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"
