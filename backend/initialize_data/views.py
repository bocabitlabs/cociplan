# Create your views here.
import logging

from drf_yasg.utils import swagger_auto_schema
from initialize_data.initializers.products import create_initial_products
from initialize_data.initializers.recipes import create_initial_recipes
from menus.serializers.products import ProductSerializer
from menus.serializers.recipes import RecipeSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger("cociplan")


class InitializeProductsView(APIView):
    """
    A viewset for viewing and editing product instances.
    """

    @swagger_auto_schema(tags=["initializers"], responses={201: ProductSerializer(many=True)})
    def post(self, request, format=None):
        """
        Initialize all the products
        """
        products_list = create_initial_products()
        serializer = ProductSerializer(products_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InitializeRecipesView(APIView):
    """
    A viewset for viewing and editing recipe instances.
    """

    @swagger_auto_schema(tags=["initializers"], responses={201: RecipeSerializer(many=True)})
    def post(self, request, format=None):
        """
        Initialize all the recipes
        """
        recipe_list = create_initial_recipes()
        serializer = RecipeSerializer(recipe_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
