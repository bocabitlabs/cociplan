const appBaseRoute = "/";
const homeRoute = "";
const recipesRoute = "recipes";
const recipesAddRoute = "add";
const productsRoute = "products";
const menusRoute = "menus";

const getRouteWithBase = (route: string) => `/${appBaseRoute}/${route}`;

export default {
  appBaseRoute,
  homeRoute,
  menusRoute,
  recipesRoute,
  productsRoute,
  recipesAddRoute,
  getRouteWithBase,
};
