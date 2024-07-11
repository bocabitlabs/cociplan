import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Group, LoadingOverlay, Paper } from "@mantine/core";
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
import {
  useAddrecipe,
  useAddRecipeImage,
  useUpdateRecipe,
} from "hooks/recipes/use-recipes";
import {
  DaysOfWeek,
  IRecipe,
  MealTemps,
  MealTypes,
  RecipeFormValues,
} from "types/recipes";
import { editorExtensions } from "utils/editor";

interface AddEditRecipeFormProps {
  recipe?: IRecipe | null;
  isUpdate?: boolean;
  isSide?: boolean;
}

export default function AddEditRecipeForm({
  recipe = null,
  isUpdate = false,
  isSide = false,
}: AddEditRecipeFormProps) {
  const { t } = useTranslation();
  const {
    data: updateData,
    mutate: updateRecipe,
    isLoading: isLoadingUpdate,
    isSuccess: isSuccessUpdate,
  } = useUpdateRecipe();
  const {
    data: createData,
    mutate: createrecipe,
    isLoading: isLoadingCreate,
    isSuccess: isSuccessCreate,
  } = useAddrecipe();
  const { mutate: uploadImage } = useAddRecipeImage();
  const navigate = useNavigate();

  const form = useForm<RecipeFormValues>({
    initialValues: {
      active: isUpdate && recipe ? recipe?.active : false,
      name: isUpdate && recipe ? recipe?.name : "",
      meal: isUpdate && recipe ? recipe?.meal : ("LUNCH" as MealTypes),
      mealTemp: isUpdate && recipe ? recipe?.mealTemp : ("WARM" as MealTemps),
      ingredients:
        isUpdate && recipe
          ? recipe?.ingredients.map((ingredient) => ({
              product: ingredient.product.id.toString(),
              quantity: ingredient.quantity,
              key: randomId(),
            }))
          : [],

      instructions: isUpdate && recipe ? recipe?.instructions : "",
      notes: isUpdate && recipe ? recipe?.notes : "",
      preferedMeal:
        isUpdate && recipe ? recipe?.preferedMeal : ("LUNCH" as MealTypes),
      preparationTime: isUpdate && recipe ? recipe?.preparationTime : 0,
      servings: isUpdate && recipe ? recipe?.servings : 0,
      sides:
        isUpdate && recipe && !isSide
          ? recipe?.sides.map((side) => ({
              id: side.id.toString(),
              key: side.id,
            }))
          : [],
      preference: isUpdate && recipe ? recipe?.preference : 0,
      difficulty: isUpdate && recipe ? recipe?.difficulty : 0,
      isSidePlate: isSide,
      isOnlyLunch: isUpdate && recipe ? recipe?.isOnlyLunch : false,
      isOnlyDinner: isUpdate && recipe ? recipe?.isOnlyDinner : false,
      isOvenRecipe: isUpdate && recipe ? recipe?.isOvenRecipe : false,
      daysOfWeek:
        isUpdate && recipe ? recipe?.daysOfWeek : ("ALL" as DaysOfWeek),
      seasonSpring: isUpdate && recipe ? recipe?.seasonSpring : false,
      seasonSummer: isUpdate && recipe ? recipe?.seasonSummer : false,
      seasonAutumn: isUpdate && recipe ? recipe?.seasonAutumn : false,
      seasonWinter: isUpdate && recipe ? recipe?.seasonWinter : false,
      image: isUpdate ? recipe?.image : null,
      type: isUpdate && recipe ? recipe?.type : "OTHER",
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

  const onSubmitUpdate = (values: any) => {
    const newValues = values;
    const filteredIngredients = values.ingredients.filter(
      (ingredient: any) => ingredient.product !== null,
    );
    newValues.ingredients = filteredIngredients;

    const filteredSides = values.sides
      .filter((side: any) => side.id !== null)
      .map((side: any) => side.id);
    newValues.sides = filteredSides;

    newValues.notes = notesEditor?.getJSON();
    newValues.instructions = instructionsEditor?.getJSON();

    if (isSide) {
      newValues.isSidePlate = true;
    }

    // Only send the image if it has changed. Otherwise, remove it from the object
    if (recipe?.image === newValues.image) {
      delete newValues.image;
    }
    console.log(newValues);
    updateRecipe({ recipeId: recipe?.id, newRecipe: newValues });
  };

  const onSubmitCreate = (values: any) => {
    const newValues = values;
    const filteredIngredients = values.ingredients.filter(
      (ingredient: any) => ingredient.product !== null,
    );
    newValues.ingredients = filteredIngredients;

    const filteredSides = values.sides
      .filter((side: any) => side.id !== null)
      .map((side: any) => side.id);
    newValues.sides = filteredSides;

    newValues.notes = notesEditor?.getJSON();
    newValues.instructions = instructionsEditor?.getJSON();

    console.log(newValues);

    createrecipe(newValues);
  };

  useEffect(() => {
    if (isSuccessUpdate) {
      if (updateData?.data.id && form.values.image) {
        uploadImage({ recipe: updateData.data.id, image: form.values.image });
      }
      form.reset();
      navigate("..");
    }
  }, [isSuccessUpdate, updateData?.data.id]);

  useEffect(() => {
    if (isSuccessCreate) {
      if (createData?.data.id && form.values.image) {
        uploadImage({ recipe: createData.data.id, image: form.values.image });
      }
      form.reset();
      navigate("..");
    }
  }, [isSuccessCreate, createData?.data.id]);

  return (
    <Group>
      <Box>
        <LoadingOverlay
          visible={isLoadingUpdate || isLoadingCreate}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          onSubmit={form.onSubmit(isUpdate ? onSubmitUpdate : onSubmitCreate)}
        >
          <Paper shadow="xs" p="md">
            <RecipeNameField form={form} />
            <RecipeEnabledField form={form} />
            <IsOvenRecipeField form={form} />
            <RecipeTypeField form={form} />
          </Paper>

          <Paper shadow="xs" p="md" mt="md">
            <MealOfTheDayFields form={form} />
            <RecipeDaysField form={form} />
            <SeasonsCheckboxes form={form} />
          </Paper>

          <Paper shadow="xs" p="md" mt="md">
            <RecipeImageField form={form} />
          </Paper>

          <Paper shadow="xs" p="md" mt="md">
            <IngredientsFields form={form} />
          </Paper>

          <Paper shadow="xs" p="md" mt="md">
            <RecipeTemperatureField form={form} />
            <ExtraFields form={form} />
          </Paper>

          {!isSide && (
            <Paper shadow="xs" p="md" mt="md">
              <SideFields form={form} />
            </Paper>
          )}
          <Paper shadow="xs" p="md" mt="md">
            <EditorField editor={instructionsEditor} title={t("Steps")} />
            <EditorField editor={notesEditor} title={t("Notes")} />
          </Paper>

          <Group mt="md">
            <Button type="submit">
              {recipe ? t("Update recipe") : t("Create recipe")}
            </Button>
          </Group>
        </form>
      </Box>
    </Group>
  );
}
