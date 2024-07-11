import { useTranslation } from "react-i18next";
import { TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

export default function RecipeNameField() {
  const { t } = useTranslation();
  const field = useField({
    initialValue: "",
  });
  return (
    <TextInput
      withAsterisk
      label={t("Name")}
      placeholder={t<string>("Lentejas, Arroz a la cubana...")}
      required
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...field.getInputProps()}
      mt="md"
    />
  );
}
