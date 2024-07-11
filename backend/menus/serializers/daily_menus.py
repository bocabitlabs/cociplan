import logging

from rest_framework import serializers

from menus.models.daily_menus import DailyMenu
from menus.models.recipes import Recipe
from menus.serializers.recipes import RecipeSerializer

logger = logging.getLogger("cociplan")


class DailyMenuSerializer(serializers.ModelSerializer):
    dinner_recipe = RecipeSerializer()
    lunch_recipe = RecipeSerializer()

    class Meta:
        model = DailyMenu
        fields = [
            "id",
            "name",
            "dinner_recipe",
            "lunch_recipe",
            "date_created",
            "last_updated",
        ]


class DailyMenuWriteSerializer(serializers.ModelSerializer):
    dinner_recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all())
    lunch_recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all())

    class Meta:
        model = DailyMenu
        fields = ["name", "dinner_recipe", "lunch_recipe"]
