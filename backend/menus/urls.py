from menus import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"products", views.ProductViewSet, basename="products")
router.register(r"ingredients", views.IngredientViewSet, basename="ingredients")
router.register(r"recipes", views.RecipeViewSet, basename="recipes")
router.register(r"daily-menus", views.DailyMenuViewSet, basename="daily_menus")
router.register(r"weekly-menus", views.WeeklyMenuViewSet, basename="weekly_menus")
