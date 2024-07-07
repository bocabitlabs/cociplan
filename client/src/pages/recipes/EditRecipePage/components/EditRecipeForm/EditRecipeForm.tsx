/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  Image,
  NumberInput,
  Rating,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconFlame, IconTrash } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import ImageDropZone from "components/ImageDropzone/ImageDropZone";
import { useProducts } from "hooks/products/use-products";
import { useUpdaterecipe } from "hooks/recipes/use-recipes";
import { IProduct } from "types/products";
import { DaysOfWeek, IRecipe, MealTemps, MealTypes } from "types/recipes";
import { getBase64 } from "utils/base_64";
import { editorExtensions } from "utils/editor";

const mealTypes = [
  { value: "LUNCH", label: "Comida" },
  { value: "DINNER", label: "Cena" },
];

const mealTemps = [
  { value: "WARM", label: "Caliente" },
  { value: "COLD", label: "Fría" },
];

const daysOfWeek = [
  { value: "WEEK_DAYS", label: "Días entre semana" },
  { value: "WEEKENDS", label: "Fines de semana" },
  { value: "ALL", label: "Todos los días" },
];

interface EditRecipeFormProps {
  recipe: IRecipe;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const { t } = useTranslation();
  const { mutate } = useUpdaterecipe();
  const { data: products, isFetching: productsFetching } = useProducts();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [base64file, setBase64file] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    console.log(acceptedFiles[0]);
    getBase64(acceptedFiles[0], (imageUrl: any) => {
      setBase64file(imageUrl);
      setFiles(acceptedFiles);
    });
  };
  const form = useForm({
    initialValues: {
      active: recipe?.active || false,
      description: recipe?.description || "",
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
        product: side.product.id.toString(),
        quantity: side.quantity,
        key: randomId(),
      })),
      preference: recipe?.preference || 0,
      difficulty: recipe?.difficulty || 0,
      isOnlyLunch: recipe?.isOnlyLunch || false,
      isOnlyDinner: recipe?.isOnlyDinner || false,
      daysOfWeek: recipe?.daysOfWeek || ("ALL" as DaysOfWeek),
      seasonSpring: recipe?.seasonSpring || false,
      seasonSummer: recipe?.seasonSummer || false,
      seasonAutumn: recipe?.seasonAutumn || false,
      seasonWinter: recipe?.seasonWinter || false,
      image: recipe?.image || null,
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

  const descriptionEditor = useEditor({
    extensions: editorExtensions,
    content: recipe ? recipe.description : "",
  });

  const getIngredients = useCallback(() => {
    const productsOptions = products.map((product: IProduct) => ({
      value: product.id.toString(),
      label: product.name,
    }));
    // Add an option at the beginning of the array
    // productsOptions.unshift({ value: null, label: "Elige un producto" });

    const fields = form.values.ingredients.map((item, index) => (
      <Group key={item.key} mt="xs">
        <Select
          withAsterisk
          searchable
          placeholder="Elije el producto"
          data={productsOptions}
          {...form.getInputProps(`ingredients.${index}.product`)}
          required
          mt="md"
        />
        <TextInput
          placeholder="Quantity"
          withAsterisk
          style={{ flex: 1 }}
          {...form.getInputProps(`ingredients.${index}.quantity`)}
        />

        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("ingredients", index)}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Group>
    ));
    return fields;
  }, [form, products]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        width={200}
        mt="md"
      />
    );
  });

  const getSides = useCallback(() => {
    const productsOptions = products.map((product: IProduct) => ({
      value: product.id.toString(),
      label: product.name,
    }));
    // Add an option at the beginning of the array
    // productsOptions.unshift({ value: null, label: "Elige un producto" });
    const fields = form.values.sides.map((item, index) => (
      <Group key={item.key} mt="xs">
        <Select
          withAsterisk
          searchable
          placeholder="Elije el producto"
          data={productsOptions}
          {...form.getInputProps(`sides.${index}.product`)}
          required
          mt="md"
        />
        <TextInput
          placeholder="Quantity"
          withAsterisk
          style={{ flex: 1 }}
          {...form.getInputProps(`sides.${index}.quantity`)}
        />

        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("sides", index)}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Group>
    ));
    return fields;
  }, [form, products]);

  const onSubmit = (values: any) => {
    const newValues = values;
    const filteredIngredients = values.ingredients.filter(
      (ingredient: any) => ingredient.product !== null,
    );

    newValues.ingredients = filteredIngredients;

    const filteredSides = values.sides.filter(
      (side: any) => side.product !== null,
    );

    newValues.sides = filteredSides;

    newValues.notes = notesEditor?.getJSON();
    newValues.instructions = instructionsEditor?.getJSON();
    newValues.description = descriptionEditor?.getJSON();
    if (base64file) {
      newValues.image = base64file;
    }

    // Only send the image if it has changed. Otherwise, remove it from the object
    if (recipe.image === newValues.image) {
      delete newValues.image;
    }

    console.log(newValues);
    mutate({ recipeId: recipe.id, newRecipe: newValues });
    navigate(-1);
  };

  if (productsFetching) {
    return <div>{t("Loading products...")}</div>;
  }
  return (
    <Group>
      <Box>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            withAsterisk
            label={t("Name")}
            placeholder="Lentejas, Arroz a la cubana..."
            required
            {...form.getInputProps("name")}
            mt="md"
          />

          <Switch
            label={t("Enabled")}
            description="Si está activada, la receta se utilizará en la generación de menús."
            {...form.getInputProps("active", { type: "checkbox" })}
            mt="md"
          />

          <Select
            label={t("Lunch of the day")}
            withAsterisk
            placeholder={t<string>("Elije la comida del día")}
            data={mealTypes}
            {...form.getInputProps("meal")}
            required
            mt="md"
          />

          <Select
            label={t("Comida del día preferida")}
            withAsterisk
            placeholder={t<string>("Elije cuando prefieres comerlo")}
            data={mealTypes}
            {...form.getInputProps("preferedMeal")}
            required
            mt="md"
          />

          <Switch
            label={t("Solo para comer")}
            {...form.getInputProps("isOnlyLunch", { type: "checkbox" })}
            mt="md"
          />

          <Switch
            label={t("Solo para cenar")}
            {...form.getInputProps("isOnlyDinner", { type: "checkbox" })}
            mt="md"
          />

          <Select
            label={t("Días de la semana")}
            withAsterisk
            placeholder={t<string>("Elije para cuándo es esta receta")}
            data={daysOfWeek}
            {...form.getInputProps("daysOfWeek")}
            required
            mt="md"
          />

          <Select
            label={t("Caliente/Fría")}
            withAsterisk
            placeholder={t<string>("Elije si es caliente o fria")}
            data={mealTemps}
            {...form.getInputProps("mealTemp")}
            required
            mt="md"
          />

          <Group mt="md">
            <SimpleGrid
              cols={{ base: 1, sm: 4 }}
              mt={previews.length > 0 ? "xl" : 0}
            >
              <ImageDropZone mt="md" onDrop={handleDrop} />

              {files.length === 0 && recipe && recipe.image && (
                <Image src={recipe.image} width={200} mt="md" />
              )}

              {previews}
            </SimpleGrid>
          </Group>

          <Text fz="lg" mt="md">
            {t("Estación de la receta")}
          </Text>
          <Group mt="xs">
            <Checkbox
              label={t("Primavera")}
              {...form.getInputProps("seasonSpring", { type: "checkbox" })}
            />
            <Checkbox
              label={t("Verano")}
              {...form.getInputProps("seasonSummer", { type: "checkbox" })}
            />
            <Checkbox
              label={t("Otoño")}
              {...form.getInputProps("seasonAutumn", { type: "checkbox" })}
            />
            <Checkbox
              label={t("Invierno")}
              {...form.getInputProps("seasonWinter", { type: "checkbox" })}
            />
          </Group>

          <Text fz="lg" mt="md">
            {t("Ingredientes")}
          </Text>

          {getIngredients()}

          <Group mt="md">
            <Button
              onClick={() =>
                form.insertListItem("ingredients", {
                  product: "0",
                  quantity: 0,
                  key: randomId(),
                })
              }
            >
              {t("Añadir ingrediente")}
            </Button>
          </Group>
          <Text fz="md" mt="md">
            {t("Preferencia")}
          </Text>
          <Rating
            value={form.values.preference}
            fractions={2}
            defaultValue={1.5}
            onChange={(value: any) => form.setFieldValue("preference", value)}
            mt="md"
          />

          <Text fz="md" mt="md">
            {t("Dificultad")}
          </Text>
          <Rating
            value={form.values.difficulty}
            fractions={2}
            defaultValue={1.5}
            onChange={(value: any) => form.setFieldValue("difficulty", value)}
            emptySymbol={<IconFlame size="1.2rem" color="gray" />}
            fullSymbol={<IconFlame size="1.2rem" color="red" />}
            mt="md"
          />

          <NumberInput
            defaultValue={18}
            placeholder="15, 30, 60..."
            label={t("Tiempo de elaboración (minutos)")}
            withAsterisk
            {...form.getInputProps("preparationTime")}
            mt="md"
          />

          <NumberInput
            defaultValue={18}
            placeholder={t<string>("Número de comensales")}
            label={t("Comensales")}
            withAsterisk
            {...form.getInputProps("servings")}
            mt="md"
          />

          <Text fz="lg" mt="md">
            {t("Acompañamientos")}
          </Text>
          {getSides()}
          <Group mt="md">
            <Button
              onClick={() =>
                form.insertListItem("sides", {
                  product: "0",
                  quantity: 0,
                  key: randomId(),
                })
              }
            >
              {t("Añadir acompañamiento")}
            </Button>
          </Group>

          <Text fz="lg" mt="md">
            {t("Descripcion")}
          </Text>

          <RichTextEditor editor={descriptionEditor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Text fz="lg" mt="md">
            {t("Pasos a seguir")}
          </Text>

          <RichTextEditor editor={instructionsEditor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Text fz="lg" mt="md">
            {t("Notas de la receta")}
          </Text>

          <RichTextEditor editor={notesEditor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Group mt="md">
            <Button type="submit">{t("Actualizar receta")}</Button>
          </Group>
        </form>
      </Box>
    </Group>
  );
}
