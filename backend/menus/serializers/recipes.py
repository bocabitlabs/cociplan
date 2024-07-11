import logging

from rest_framework import serializers

from menus.models.ingredients import Ingredient
from menus.models.products import Product
from menus.models.recipes import Recipe, RecipeImage
from menus.serializers.ingredients import (
    IngredientSerializer,
    IngredientWriteSerializer,
)

logger = logging.getLogger("cociplan")


class RecipeImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeImage
        fields = ["recipe", "image"]


class RecipeImageWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeImage
        fields = ["recipe", "image"]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    sides = serializers.SerializerMethodField()
    image = RecipeImageSerializer()

    class Meta:
        model = Recipe
        fields = [
            "id",
            "active",
            "difficulty",
            "image",
            "ingredients",
            "instructions",
            "is_only_dinner",
            "is_only_lunch",
            "is_oven_recipe",
            "is_side_plate",
            "can_be_dinner",
            "can_be_lunch",
            "days_of_week",
            "meal",
            "name",
            "notes",
            "meal_temp",
            "preference",
            "prefered_meal",
            "preparation_time",
            "servings",
            "season_spring",
            "season_summer",
            "season_autumn",
            "season_winter",
            "sides",
            "type",
            "date_created",
            "last_updated",
        ]

    # This function will return all childs..is necessary put the context label
    def get_sides(self, entity):
        return RecipeSerializer(
            entity.sides.all(),
            many=True,
            # should pass this `entity` instance as context variable for filtering
            context={"entity_instance": entity},
        ).data


class RecipeWriteSerializer(serializers.ModelSerializer):
    ingredients = IngredientWriteSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "active",
            "difficulty",
            "ingredients",
            "instructions",
            "is_only_dinner",
            "is_only_lunch",
            "is_oven_recipe",
            "is_side_plate",
            "can_be_dinner",
            "can_be_lunch",
            "days_of_week",
            "meal",
            "name",
            "notes",
            "meal_temp",
            "preference",
            "prefered_meal",
            "preparation_time",
            "servings",
            "season_spring",
            "season_summer",
            "season_autumn",
            "season_winter",
            "sides",
            "type",
            "date_created",
            "last_updated",
        ]

    def create(self, validated_data):
        ingredients = validated_data.pop("ingredients", [])
        sides = validated_data.pop("sides", [])
        logger.debug(validated_data)

        instance = Recipe.objects.create(**validated_data)
        logger.debug(ingredients)
        for ingredient in ingredients:
            product_id = ingredient.pop("product").id
            if product_id != 0:
                product = Product.objects.get(pk=product_id)
                Ingredient.objects.create(
                    product=product, recipe=instance, **ingredient
                )

        for side in sides:
            instance.sides.add(side)

        return instance

    def update(self, instance: Recipe, validated_data):
        ingredients = validated_data.pop("ingredients", [])
        sides = validated_data.pop("sides", [])

        # Remove existing elements from the relationship
        instance.ingredients.all().delete()
        instance.sides.all().delete()
        logger.debug(validated_data)

        for ingredient in ingredients:
            logger.debug(ingredient)
            product_id = ingredient.pop("product").id
            if product_id:
                product = Product.objects.get(pk=product_id)
                Ingredient.objects.update_or_create(
                    product=product, recipe=instance, defaults=ingredient
                )

        for side in sides:
            logger.debug(side)
            instance.sides.add(side)

        instance.save()
        instance = super().update(instance, validated_data)

        return instance
