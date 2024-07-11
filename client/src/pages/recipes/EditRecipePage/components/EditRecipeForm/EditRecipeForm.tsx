/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
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
import SideFields from "components/form-fields/recipes/SideFields/SideFields";
import { useAddRecipeImage, useUpdateRecipe } from "hooks/recipes/use-recipes";
import {
  DaysOfWeek,
  IRecipe,
  MealTemps,
  MealTypes,
  RecipeFormValues,
} from "types/recipes";
import { editorExtensions } from "utils/editor";

interface EditRecipeFormProps {
  recipe: IRecipe;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const { t } = useTranslation();
  const { data, mutate, isLoading, isSuccess } = useUpdateRecipe();
  const { mutate: uploadImage } = useAddRecipeImage();
  const navigate = useNavigate();

  const form = useForm<RecipeFormValues>({
    initialValues: {
      active: recipe?.active || false,
      name: recipe?.name || "",
      meal: recipe?.meal || ("LUNCH" as MealTypes),
      mealTemp: recipe?.mealTemp || ("WARM" as MealTemps),
      ingredients: recipe.ingredients.map((ingredient) => ({
        product: ingredient.product.id.toString(),
        quantity: ingredient.quantity,
        key: randomId(),
      })),

      instructions: recipe?.instructions || "",
      notes: recipe?.notes || "",
      preferedMeal: recipe?.preferedMeal || ("LUNCH" as MealTypes),
      preparationTime: recipe?.preparationTime || 0,
      servings: recipe?.servings || 0,
      sides: recipe.sides.map((side) => ({
        id: side.id.toString(),
        key: side.id,
      })),
      preference: recipe?.preference || 0,
      difficulty: recipe?.difficulty || 0,
      isSidePlate: false,
      isOnlyLunch: recipe?.isOnlyLunch || false,
      isOnlyDinner: recipe?.isOnlyDinner || false,
      isOvenRecipe: recipe?.isOvenRecipe || false,
      daysOfWeek: recipe?.daysOfWeek || ("ALL" as DaysOfWeek),
      seasonSpring: recipe?.seasonSpring || false,
      seasonSummer: recipe?.seasonSummer || false,
      seasonAutumn: recipe?.seasonAutumn || false,
      seasonWinter: recipe?.seasonWinter || false,
      image: recipe?.image || null,
      type: recipe?.type || "OTHER",
    },
  });

  const notesEditor = useEditor({
    extensions: editorExtensions,
    content: recipe ? recipe.notes : "",
  });

  const instructionsEditor = useEditor({
    extensions: editorExtensions,
    content: recipe ? recipe.instructions : "",
  });

  const onSubmit = (values: any) => {
    const newValues = values;
    const filteredIngredients = values.ingredients.filter(
      (ingredient: any) => ingredient.product !== null,
    );
    newValues.ingredients = filteredIngredients;

    const filteredSides = values.sides.filter((side: any) => side.id !== null);
    newValues.sides = filteredSides;

    newValues.notes = notesEditor?.getJSON();
    newValues.instructions = instructionsEditor?.getJSON();

    // Only send the image if it has changed. Otherwise, remove it from the object
    if (recipe.image === newValues.image) {
      delete newValues.image;
    }

    mutate({ recipeId: recipe.id, newRecipe: newValues });
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.data.id && form.values.image) {
        uploadImage({ recipe: data.data.id, image: form.values.image });
      }
      form.reset();
      navigate("..");
    }
  }, [isSuccess, data?.data.id]);

  return (
    <Group>
      <Box>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
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
          <SideFields form={form} />

          <EditorField editor={instructionsEditor} title={t("Steps")} />
          <EditorField editor={notesEditor} title={t("Notes")} />

          <Group mt="md">
            <Button type="submit">{t("Update recipe")}</Button>
          </Group>
        </form>
      </Box>
    </Group>
  );
}
