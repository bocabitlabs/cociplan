import { useTranslation } from "react-i18next";
import { Switch } from "@mantine/core";

type Props = { form: any };

export default function IsOvenRecipeField({ form }: Props) {
  const { t } = useTranslation();
  return (
    <Switch
      label={t("Is an oven recipe")}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("isOvenRecipe", { type: "checkbox" })}
      mt="md"
    />
  );
}
