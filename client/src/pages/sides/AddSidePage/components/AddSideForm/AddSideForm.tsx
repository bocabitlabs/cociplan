import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Group, Text, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import EditorField from "components/form-fields/recipes/EditorField/EditorField";
import ExtraFields from "components/form-fields/recipes/ExtraFields/ExtraFields";
import IngredientsFields from "components/form-fields/recipes/IngredientsFields/IngredientsFields";
import IsOvenRecipeField from "components/form-fields/recipes/IsOvenRecipeField/IsOvenRecipeField";
import MealOfTheDayFields from "components/form-fields/recipes/MealOfTheDayFields/MealOfTheDayFields";
import RecipeDaysField from "components/form-fields/recipes/RecipeDaysField/RecipeDaysField";
import RecipeEnabledField from "components/form-fields/recipes/RecipeEnabledField/RecipeEnabledField";
import RecipeImageField from "components/form-fields/recipes/RecipeImageField/RecipeImageField";
import RecipeNameField from "components/form-fields/recipes/RecipeNameField/RecipeNameField";
import RecipeTemperatureField from "components/form-fields/recipes/RecipeTemperatureField/RecipeTemperatureField";
import RecipeTypeField from "components/form-fields/recipes/RecipeTypeField/RecipeTypeField";
import SeasonsCheckboxes from "components/form-fields/recipes/SeasonsCheckboxes/SeasonsCheckboxes";
import { useAddrecipe, useAddRecipeImage } from "hooks/recipes/use-recipes";
import { DaysOfWeek, MealTemps, MealTypes } from "types/recipes";
import { editorExtensions } from "utils/editor";

export default function AddSideForm() {
  const { t } = useTranslation();
  const { data, mutate, isLoading, isSuccess } = useAddrecipe();
  const { mutate: uploadImage } = useAddRecipeImage();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      active: true,
      name: "",
      meal: "LUNCH" as MealTypes,
      mealTemp: "WARM" as MealTemps,
      ingredients: [{ product: null, quantity: 0, key: null }],
      instructions: "",
      notes: "",
      preferedMeal: "LUNCH" as MealTypes,
      preparationTime: 0,
      servings: 2,
      sides: [],
      preference: 0,
      difficulty: 0,
      isOnlyLunch: false,
      isOnlyDinner: false,
      isOvenRecipe: false,
      daysOfWeek: "ALL" as DaysOfWeek,
      seasonSpring: true,
      seasonSummer: true,
      seasonAutumn: true,
      seasonWinter: true,
      image: null,
      type: "OTHER",
    },
  });

  const notesEditor = useEditor({
    extensions: editorExtensions,
  });

  const instructionsEditor = useEditor({
    extensions: editorExtensions,
  });

  const onSubmit = (values: any) => {
    const newValues = values;
    const filteredIngredients = values.ingredients.filter(
      (ingredient: any) => ingredient.product !== null,
    );
    newValues.ingredients = filteredIngredients;

    newValues.isSidePlate = true;

    newValues.notes = notesEditor?.getJSON();
    newValues.instructions = instructionsEditor?.getJSON();

    mutate(newValues);
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.data.id && form.values.image) {
        uploadImage({ recipe: data.data.id, image: form.values.image });
      }
      form.reset();
      navigate("..");
    }
  }, [isSuccess, form, navigate]);

  return (
    <Group>
      <Box>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Text>{t("Add a side meal.")}</Text>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <RecipeNameField form={form} />

          <RecipeEnabledField form={form} />
          <MealOfTheDayFields form={form} />
          <IsOvenRecipeField form={form} />
          <RecipeTypeField form={form} />
          <RecipeDaysField form={form} />
          <RecipeTemperatureField form={form} />
          <RecipeImageField form={form} />
          <SeasonsCheckboxes form={form} />
          <IngredientsFields form={form} />
          <ExtraFields form={form} />

          <EditorField editor={instructionsEditor} title={t("Steps")} />
          <EditorField editor={notesEditor} title={t("Notes")} />

          <Group mt="md">
            <Button type="submit">{t("Create side")}</Button>
          </Group>
        </form>
      </Box>
    </Group>
  );
}
