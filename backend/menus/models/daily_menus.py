from django.db import models
from menus.models.recipes import Recipe


# https://pypi.org/project/django-types/
# Create your models here.
class DailyMenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200)

    lunch_recipe_id: int
    lunch_recipe = models.ForeignKey["Recipe", Recipe](Recipe, on_delete=models.CASCADE, related_name="lunches")

    dinner_recipe_id: int
    dinner_recipe = models.ForeignKey["Recipe", Recipe](Recipe, on_delete=models.CASCADE, related_name="dinners")

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_updated"]
        verbose_name = "DailyMenu"
        verbose_name_plural = "Daily Menus"

    def __str__(self) -> str:
        return f"{self.name} - {self.date_created}"
