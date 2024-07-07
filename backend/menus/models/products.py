from django.db import models


class ProductType(models.TextChoices):
    NONE = "NONE"
    EGG_MILK_PRODUCTS = "EGG_MILK_PRODUCTS"
    FATS_OILS = "FATS_OILS"
    FRUITS = "FRUITS"
    GRAIN_NUTS_BAKING = "GRAIN_NUTS_BAKING"
    HERBS_SPICES = "HERBS_SPICES"
    MEAT_SASUAGE = "MEAT_SASUAGE"
    FISH = "FISH"
    PASTA_RICE = "PASTA_RICE"
    VEGETABLES = "VEGETABLES"
    LEGUMES = "LEGUMES"
    OTHER = "OTHER"


# Create your models here.
class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200, unique=True)
    type = models.CharField(
        choices=ProductType.choices, default=ProductType.NONE, max_length=200
    )

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self) -> str:
        return f"{self.name}"
