import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "Layout";
import HomePage from "pages/home/HomePage/HomePage";
import DayMenuDetailsPage from "pages/menus/DayMenuDetailsPage/DayMenuDetailsPage";
import MenuDetailsPage from "pages/menus/MenuDetailsPage/MenuDetailsPage";
import ProductsPage from "pages/products/ProductsPage/ProductsPage";
import AddRecipePage from "pages/recipes/AddRecipePage/AddRecipePage";
import EditRecipePage from "pages/recipes/EditRecipePage/EditRecipePage";
import RecipeDetailsPage from "pages/recipes/RecipeDetailsPage/RecipeDetailsPage";
import RecipesPage from "pages/recipes/RecipesPage/RecipesPage";
import AddSidePage from "pages/sides/AddSidePage/AddSidePage";
import EditSidePage from "pages/sides/EditSidePage/EditSidePage";
import SidesPage from "pages/sides/SidesPage/SidesPage";
import routes from "routes";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: routes.productsRoute, element: <ProductsPage /> },
      {
        path: "/recipes/*",
        children: [
          { index: true, element: <RecipesPage /> },
          { path: ":recipeId", element: <RecipeDetailsPage /> },
          { path: ":recipeId/edit", element: <EditRecipePage /> },
          { path: "add", element: <AddRecipePage /> },
        ],
      },
      {
        path: "/sides/*",
        children: [
          { index: true, element: <SidesPage /> },
          { path: ":recipeId", element: <RecipeDetailsPage /> },
          { path: ":recipeId/edit", element: <EditSidePage /> },
          { path: "add", element: <AddSidePage /> },
        ],
      },
      {
        path: "/menus/*",
        children: [
          { path: ":menuId", element: <MenuDetailsPage /> },
          { path: ":menuId/:dayName", element: <DayMenuDetailsPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
