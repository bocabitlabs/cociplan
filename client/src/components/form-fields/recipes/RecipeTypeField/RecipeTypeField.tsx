import { useTranslation } from "react-i18next";
import { NativeSelect } from "@mantine/core";
import { IRecipeTypes } from "types/recipes-types";

type Props = { form: any };

export default function RecipeTypeField({ form }: Props) {
  const { t } = useTranslation();

  const recipeTypes = Object.keys(IRecipeTypes).map((recipeType) => ({
    value: recipeType,
    label: t<string>(recipeType),
  }));

  return (
    <NativeSelect
      label={t("Recipe type")}
      withAsterisk
      description={t<string>("Select a type for the recipe")}
      data={recipeTypes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("type")}
      required
    />
  );
}
