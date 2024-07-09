const appBaseRoute = "/";
const homeRoute = "";
const recipesRoute = "recipes";
const sidesRoute = "sides";
const recipesAddRoute = "add";
const sidesAddRoute = "add";
const productsRoute = "products";
const menusRoute = "menus";

const getRouteWithBase = (route: string) => `/${appBaseRoute}/${route}`;

export default {
  appBaseRoute,
  homeRoute,
  menusRoute,
  recipesRoute,
  sidesRoute,
  sidesAddRoute,
  productsRoute,
  recipesAddRoute,
  getRouteWithBase,
};
