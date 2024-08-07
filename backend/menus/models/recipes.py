from typing import TYPE_CHECKING

from django.db import models

if TYPE_CHECKING:
    # This doesn't really exists on django so it always need to be imported this way
    from django.db.models.manager import RelatedManager

    from menus.models.ingredients import Ingredient  # noqa


class RecipeType(models.TextChoices):
    MEAT_SASUAGE = "MEAT_SASUAGE"
    FISH = "FISH"
    VEGETABLES = "VEGETABLES"
    LEGUMES = "LEGUMES"
    EGGS = "EGGS"
    FRUITS = "FRUITS"
    MILK_PRODUCTS = "MILK_RECIPE"
    GRAIN_NUTS = "GRAIN_NUTS"
    BAKING = "BAKING"
    POULTRY = "POULTRY"  # Aves
    PASTA = "PASTA"
    RICE = "RICE"
    POTATOES = "POTATOES"
    SOUPS = "SOUPS"
    OTHER = "OTHER"
    DESSERTS = "DESSERTS"
    NONE = "NONE"


def user_directory_path(instance, filename) -> str:
    return f"user/{filename}"


class MealType(models.TextChoices):
    LUNCH = "LUNCH"
    DINNER = "DINNER"
    BOTH = "BOTH"


class MealTempType(models.TextChoices):
    WARM = "WARM"
    COLD = "COLD"


class DaysOfWeekType(models.TextChoices):
    WEEK_DAYS = "WEEK_DAYS"
    WEEKENDS = "WEEKENDS"
    ALL = "ALL"


class Recipe(models.Model):
    id = models.BigAutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200, unique=True)
    meal = models.CharField(
        choices=MealType.choices, default=MealType.LUNCH, max_length=200
    )
    meal_temp = models.CharField(
        choices=MealTempType.choices, default=MealTempType.WARM, max_length=200
    )
    notes: models.JSONField = models.JSONField(blank=True)
    instructions: models.JSONField = models.JSONField(blank=True)

    difficulty: models.DecimalField = models.DecimalField(
        max_digits=2, decimal_places=1, default=1
    )
    preference: models.DecimalField = models.DecimalField(
        max_digits=2, decimal_places=1, default=1
    )
    prefered_meal = models.CharField(
        choices=MealType.choices, default=MealType.LUNCH, max_length=200
    )

    active: models.BooleanField = models.BooleanField(default=True)

    is_oven_recipe: models.BooleanField = models.BooleanField(default=False)

    is_side_plate: models.BooleanField = models.BooleanField(default=False)

    days_of_week = models.CharField(
        choices=DaysOfWeekType.choices, default=DaysOfWeekType.ALL, max_length=200
    )

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    preparation_time: models.IntegerField = models.IntegerField(
        blank=True, null=True, default=0
    )
    servings: models.IntegerField = models.IntegerField(
        blank=True, null=True, default=0
    )

    sides = models.ManyToManyField("self", symmetrical=False, blank=True)

    season_spring: models.BooleanField = models.BooleanField(default=True)
    season_summer: models.BooleanField = models.BooleanField(default=True)
    season_autumn: models.BooleanField = models.BooleanField(default=True)
    season_winter: models.BooleanField = models.BooleanField(default=True)

    type = models.CharField(
        choices=RecipeType.choices, default=RecipeType.NONE, max_length=200
    )

    if TYPE_CHECKING:
        ingredients = RelatedManager["Ingredient"]()
        sides = RelatedManager["Side"]()

    class Meta:
        ordering = ["name"]
        verbose_name = "Recipe"
        verbose_name_plural = "Recipes"

    def __str__(self) -> str:
        return f"{self.name}"


class RecipeImage(models.Model):
    image: models.ImageField = models.ImageField(
        upload_to=user_directory_path, blank=True, null=True
    )
    recipe = models.OneToOneField(
        Recipe,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="image",
    )

    class Meta:
        ordering = ["recipe"]
        verbose_name = "Recipe Image"
        verbose_name_plural = "Recipe Images"

    def __str__(self) -> str:
        return f"{self.recipe}"
