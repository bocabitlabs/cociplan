/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";
import { useInitializeRecipes } from "hooks/recipes/use-recipes";

export default function InitializeRecipesButton() {
  const { mutate } = useInitializeRecipes();
  const { t } = useTranslation();

  const onClick = () => {
    mutate();
  };

  return (
    <Button variant="outline" onClick={onClick}>
      {t("Initialize recipes")}
    </Button>
  );
}
