from rest_framework import serializers

from menus.models.products import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "type", "date_created", "last_updated"]


class ProductSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
        ]
