import { useTranslation } from "react-i18next";
import { Select } from "@mantine/core";
import { MealTypes } from "types/recipes-types";

type Props = { form: any };

export default function MealOfTheDayFields({ form }: Props) {
  const { t } = useTranslation();

  const preferedMealTypes = [
    { value: "LUNCH", label: t("Lunch") },
    { value: "DINNER", label: t("Dinner") },
  ];

  return (
    <>
      <Select
        label={t("Meal of the day")}
        withAsterisk
        data={Object.keys(MealTypes).map((mealType) => ({
          value: mealType,
          label: t(mealType),
        }))}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps("meal")}
        required
        mt="md"
      />
      {form.getValues().meal === MealTypes.BOTH && (
        <Select
          label={t("Prefered meal of the day")}
          withAsterisk
          placeholder={t<string>("When do you prefer to eat this meal?")}
          data={preferedMealTypes}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("preferedMeal")}
          required
          mt="md"
        />
      )}
    </>
  );
}
