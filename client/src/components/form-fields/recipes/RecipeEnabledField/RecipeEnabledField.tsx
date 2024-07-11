import { useTranslation } from "react-i18next";
import { Switch } from "@mantine/core";

type Props = { form: any };

export default function RecipeEnabledField({ form }: Props) {
  const { t } = useTranslation();
  return (
    <Switch
      label={t("Enabled")}
      description={t(
        "If enabled, the recipe will be used to generate the weekly menus.",
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("active", { type: "checkbox" })}
      mt="md"
    />
  );
}
