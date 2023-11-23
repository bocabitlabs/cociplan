# type: ignore

from django.urls import path
from initialize_data import views

urlpatterns = [
    path("products/", views.InitializeProductsView.as_view(), name="initialize_products"),
    path("recipes/", views.InitializeRecipesView.as_view(), name="initialize_recipes"),
]
