import { useTranslation } from "react-i18next";
import { Select } from "@mantine/core";

type Props = { form: any };

export default function RecipeDaysField({ form }: Props) {
  const { t } = useTranslation();
  const daysOfWeek = [
    { value: "WEEK_DAYS", label: t("Work days") },
    { value: "WEEKENDS", label: t("Weekends") },
    { value: "ALL", label: t("All the days") },
  ];
  return (
    <Select
      label={t("Days of the week")}
      withAsterisk
      placeholder={t<string>("When do you want to eat it?")}
      data={daysOfWeek}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps("daysOfWeek")}
      required
      mt="md"
    />
  );
}
