/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Rating,
  Text,
  TextInput,
  NumberInput,
  Select,
  Switch,
  Image,
  Checkbox,
  SimpleGrid,
  LoadingOverlay,
} from "@mantine/core";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconFlame, IconTrash } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import ImageDropZone from "components/ImageDropzone/ImageDropZone";
import { useProducts } from "hooks/products/use-products";
import { useAddrecipe } from "hooks/recipes/use-recipes";
import { IProduct } from "types/products";
import { DaysOfWeek, MealTemps, MealTypes } from "types/recipes";
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

export default function AddRecipeForm() {
  const { t } = useTranslation();
  const { mutate, isLoading } = useAddrecipe();
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
        height="auto"
      />
    );
  });

  const form = useForm({
    initialValues: {
      active: true,
      description: "",
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
      daysOfWeek: "ALL" as DaysOfWeek,
      seasonSpring: true,
      seasonSummer: true,
      seasonAutumn: true,
      seasonWinter: true,
      image: null,
    },
  });

  const notesEditor = useEditor({
    extensions: editorExtensions,
  });

  const instructionsEditor = useEditor({
    extensions: editorExtensions,
  });

  const descriptionEditor = useEditor({
    extensions: editorExtensions,
  });

  if (productsFetching) {
    return <div>{t("Loading...")}</div>;
  }

  const getIngredients = () => {
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
          placeholder={t<string>("Elije el producto")}
          data={productsOptions}
          {...form.getInputProps(`ingredients.${index}.product`)}
          required
          mt="md"
        />
        <TextInput
          placeholder={t<string>("Quantity")}
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
  };

  const getSides = () => {
    const productsOptions = products.map((product: IProduct) => ({
      value: product.id.toString(),
      label: product.name,
    }));

    const fields = form.values.sides.map((item: any, index) => (
      <Group key={item.key} mt="xs">
        <Select
          withAsterisk
          searchable
          placeholder={t<string>("Elije el producto")}
          data={productsOptions}
          {...form.getInputProps(`sides.${index}.product`)}
          required
          mt="md"
        />
        <TextInput
          placeholder={t<string>("Quantity")}
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
  };

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
    // eslint-disable-next-line prefer-destructuring
    newValues.image = base64file || null;

    mutate(newValues);
    navigate(-1);
  };

  return (
    <Group>
      <Box>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Text>
          {t(
            "Añade una receta a tu lista de recetas utilizando este formulario.",
          )}
        </Text>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            withAsterisk
            label={t("Name")}
            placeholder={t<string>("Lentejas, Arroz a la cubana...")}
            required
            {...form.getInputProps("name")}
            mt="md"
          />

          <Switch
            label={t("Activada")}
            description={t(
              "Si está activada, la receta se utilizará en la generación de menús.",
            )}
            {...form.getInputProps("active", { type: "checkbox" })}
            mt="md"
          />

          <Select
            label={t("Comida del día")}
            withAsterisk
            placeholder={t<string>("Elije la comida del día")}
            data={mealTypes}
            {...form.getInputProps("meal")}
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
            label={t("Comida del día preferida")}
            withAsterisk
            placeholder={t<string>("Elije cuando prefieres comerlo")}
            data={mealTypes}
            {...form.getInputProps("preferedMeal")}
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
              <ImageDropZone
                accept={IMAGE_MIME_TYPE}
                mt="md"
                onDrop={handleDrop}
              />

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

          <RichTextEditor editor={descriptionEditor} style={{ minHeight: 200 }}>
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

          <RichTextEditor
            editor={instructionsEditor}
            style={{ minHeight: 200 }}
          >
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

          <RichTextEditor editor={notesEditor} style={{ minHeight: 200 }}>
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
            <Button type="submit">{t("Crear receta")}</Button>
          </Group>
        </form>
      </Box>
    </Group>
  );
}
