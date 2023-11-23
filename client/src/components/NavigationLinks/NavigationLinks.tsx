/* eslint-disable react/jsx-props-no-spreading */
import { IconBaguette, IconChefHat } from "@tabler/icons-react";
import NavigationLink from "./NavigationLink";
import routes from "routes";

const data = [
  {
    icon: <IconChefHat size={16} />,
    color: "blue",
    label: "Weekly menus",
    route: routes.homeRoute,
  },
  {
    icon: <IconBaguette size={16} />,
    color: "green",
    label: "Products",
    route: routes.productsRoute,
  },
  {
    icon: <IconChefHat size={16} />,
    color: "red",
    label: "Recipes",
    route: routes.recipesRoute,
  },
];

export default function NavigationLinks() {
  let links = [];

  links = data.map((link) => (
    <NavigationLink {...link} key={link.label} to={link.route} />
  ));

  return <div>{links}</div>;
}
