import logging

from menus.models.ingredients import Ingredient
from menus.serializers.products import ProductSerializer
from rest_framework import serializers

logger = logging.getLogger("cociplan")


class IngredientSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Ingredient
        fields = ["id", "quantity", "product", "recipe", "date_created", "last_updated"]


class IngredientWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["product", "quantity"]

    def create(self, validated_data):
        logger.debug(validated_data)
        # order = Product.objects.get(pk=validated_data.pop("product"))
        instance = Ingredient.objects.create(**validated_data)
        # Recipe.objects.create(Product=order, Ingredient=instance)
        return instance
