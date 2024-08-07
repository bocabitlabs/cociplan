import logging

from django.db.models.query import QuerySet
from rest_framework import filters, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from menus.models.daily_menus import DailyMenu
from menus.models.ingredients import Ingredient
from menus.models.products import Product
from menus.models.recipes import Recipe, RecipeImage
from menus.models.weekly_menus import WeeklyMenu
from menus.serializers.daily_menus import DailyMenuSerializer, DailyMenuWriteSerializer
from menus.serializers.ingredients import IngredientSerializer
from menus.serializers.products import ProductSelectSerializer, ProductSerializer
from menus.serializers.recipes import (
    RecipeImageSerializer,
    RecipeSelectSerializer,
    RecipeSerializer,
    RecipeWriteSerializer,
)
from menus.serializers.weekly_menus import (
    WeeklyMenuPatchSerializer,
    WeeklyMenuSerializer,
    WeeklyMenuWriteSerializer,
)
from menus.utils.weekly_menu_generator import create_new_weekly_menu
from menus.utils.weekly_menu_generator_gpt import create_new_weekly_menu_gpt

logger = logging.getLogger("cociplan")


class ProductViewSetNoLimit(viewsets.ModelViewSet):
    serializer_class = ProductSelectSerializer
    queryset = Product.objects.all().order_by("name")
    pagination_class = None


class ProductViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Product instances.
    """

    serializer_class = ProductSerializer
    queryset = Product.objects.all().order_by("name")
    search_fields = ["name"]
    filter_backends = (filters.SearchFilter,)


class IngredientViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Ingredient instances.
    """

    serializer_class = IngredientSerializer
    queryset = Ingredient.objects.all()


class RecipeImageViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Ingredient instances.
    """

    serializer_class = RecipeImageSerializer
    queryset = RecipeImage.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class RecipesViewSetNoLimit(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecipeSelectSerializer
    queryset = Recipe.objects.all().filter(is_side_plate=False).order_by("name")
    pagination_class = None


class SideViewSetNoLimit(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecipeSelectSerializer
    queryset = Recipe.objects.all().filter(is_side_plate=True).order_by("name")
    pagination_class = None


class RecipeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Recipe instances.
    """

    serializer_class = RecipeWriteSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return RecipeSerializer
        return super().get_serializer_class()

    def get_queryset(self) -> QuerySet[Recipe]:
        queryset = Recipe.objects.all()
        if self.action == "list":
            only_sides = self.request.query_params.get("isSidePlate")
            if only_sides is not None:
                queryset = (
                    Recipe.objects.all().filter(is_side_plate=True).order_by("name")
                )
            else:
                queryset = (
                    Recipe.objects.all().filter(is_side_plate=False).order_by("name")
                )
        return queryset


class DailyMenuViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Daily Menu instances.
    """

    serializer_class = DailyMenuWriteSerializer
    queryset = DailyMenu.objects.all().order_by("-date_created")

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return DailyMenuSerializer
        return super().get_serializer_class()


class WeeklyMenuViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Weekly Menu instances.
    """

    serializer_class = WeeklyMenuWriteSerializer
    queryset = WeeklyMenu.objects.all().order_by("-date_created")

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return WeeklyMenuSerializer
        if self.action == "update" or self.action == "partial_update":
            return WeeklyMenuPatchSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        logger.info(f"Creating WeeklyMenu: {serializer.validated_data}")
        use_classic = self.request.query_params.get("classic")

        if use_classic == "true":
            create_new_weekly_menu(serializer)
        else:
            create_new_weekly_menu_gpt(serializer)
