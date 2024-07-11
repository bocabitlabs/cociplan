import { useTranslation } from "react-i18next";
import { Select } from "@mantine/core";

type Props = { form: any };

export default function RecipeTemperatureField({ form }: Props) {
  const { t } = useTranslation();
  const mealTemps = [
    { value: "WARM", label: t("Warm") },
    { value: "COLD", label: t("Cold") },
  ];
  return (
    <Select
      label={t("Temperature")}
      withAsterisk
      placeholder={t<string>("Is it warm or cold?")}
      data={mealTemps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("mealTemp")}
      required
      mt="md"
    />
  );
}
