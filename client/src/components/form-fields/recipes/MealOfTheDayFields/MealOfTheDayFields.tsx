import { useTranslation } from "react-i18next";
import { Group, Select, Switch } from "@mantine/core";

type Props = { form: any };

export default function MealOfTheDayFields({ form }: Props) {
  const { t } = useTranslation();
  const mealTypes = [
    { value: "LUNCH", label: t("Lunch") },
    { value: "DINNER", label: t("Dinner") },
  ];
  return (
    <>
      <Select
        label={t("Prefered meal of the day")}
        withAsterisk
        placeholder={t<string>("When do you prefer to eat this meal?")}
        data={mealTypes}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps("preferedMeal")}
        required
        mt="md"
      />
      <Group>
        <Switch
          label={t("Only for lunch")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("isOnlyLunch", { type: "checkbox" })}
          mt="md"
        />

        <Switch
          label={t("Only for dinner")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("isOnlyDinner", { type: "checkbox" })}
          mt="md"
        />
      </Group>
    </>
  );
}
