import logging

from menus.models.sides import Side
from menus.serializers.products import ProductSerializer
from rest_framework import serializers

logger = logging.getLogger("cociplan")


class SideSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Side
        fields = ["id", "quantity", "product", "recipe", "date_created", "last_updated"]


class SideWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Side
        fields = ["product", "quantity"]

    def create(self, validated_data):
        logger.debug(validated_data)
        # order = Product.objects.get(pk=validated_data.pop("product"))
        instance = Side.objects.create(**validated_data)
        # Recipe.objects.create(Product=order, Ingredient=instance)
        return instance
