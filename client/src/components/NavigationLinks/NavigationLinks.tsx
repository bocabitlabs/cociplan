/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from "react-i18next";
import { IconBaguette, IconChefHat, IconCooker } from "@tabler/icons-react";
import NavigationLink from "./NavigationLink";
import routes from "routes";

export default function NavigationLinks() {
  const { t } = useTranslation();
  let links = [];
  const data = [
    {
      icon: <IconChefHat size={16} />,
      color: "blue",
      label: t("Weekly menus"),
      route: routes.homeRoute,
    },
    {
      icon: <IconChefHat size={16} />,
      color: "red",
      label: t("Recipes"),
      route: routes.recipesRoute,
    },
    {
      icon: <IconCooker size={16} />,
      color: "orange",
      label: t("Sides"),
      route: routes.sidesRoute,
    },
    {
      icon: <IconBaguette size={16} />,
      color: "green",
      label: t("Products"),
      route: routes.productsRoute,
    },
  ];

  links = data.map((link) => (
    <NavigationLink {...link} key={link.label} to={link.route} />
  ));

  return <div>{links}</div>;
}
