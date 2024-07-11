import { useTranslation } from "react-i18next";
import { TextInput } from "@mantine/core";

export default function RecipeNameField({ form }: { form: any }) {
  const { t } = useTranslation();

  return (
    <TextInput
      withAsterisk
      label={t("Name")}
      placeholder={t<string>("Lentils, Rice with tomato sauce...")}
      required
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("name")}
      mt="md"
    />
  );
}
