import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "App";
import HomePage from "pages/home/HomePage/HomePage";
import DayMenuDetailsPage from "pages/menus/DayMenuDetailsPage/DayMenuDetailsPage";
import MenuDetailsPage from "pages/menus/MenuDetailsPage/MenuDetailsPage";
import MenusMain from "pages/menus/MenusMain";
import ProductsPage from "pages/products/ProductsPage/ProductsPage";
import AddRecipePage from "pages/recipes/AddRecipePage/AddRecipePage";
import EditRecipePage from "pages/recipes/EditRecipePage/EditRecipePage";
import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage/RecipeDetailsPage";
import RecipesMain from "pages/recipes/RecipesMain";
import RecipesPage from "pages/recipes/RecipesPage/RecipesPage";
import routes from "routes";

export default function Main(): ReactElement {
  return (
    <MantineProvider defaultColorScheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path={routes.productsRoute} element={<ProductsPage />} />
            <Route path="recipes" element={<RecipesMain />}>
              <Route path="" element={<RecipesPage />} />
              <Route path=":recipeId" element={<RecipeDetailsPage />} />
              <Route path=":recipeId/edit" element={<EditRecipePage />} />
              <Route
                path={routes.recipesAddRoute}
                element={<AddRecipePage />}
              />
            </Route>
            <Route path="menus" element={<MenusMain />}>
              <Route path=":menuId" element={<MenuDetailsPage />} />
              <Route path=":menuId/:dayName" element={<DayMenuDetailsPage />} />
            </Route>

            {/* <Route path="recipes/:id" element={<RecipeDetailsPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <Notifications position="top-center" />
    </MantineProvider>
  );
}
