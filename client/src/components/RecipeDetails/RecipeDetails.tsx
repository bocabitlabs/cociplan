/* eslint-disable react/no-danger */
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Badge,
  Grid,
  Group,
  List,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
  Image,
} from "@mantine/core";
import { IconClock, IconEdit, IconFlame, IconUsers } from "@tabler/icons-react";
import { generateHTML } from "@tiptap/core";
import { IIngredient } from "types/ingredients";
import { IRecipe } from "types/recipes";
import { editorExtensions, renderExtensions } from "utils/editor";

interface Props {
  recipe: IRecipe;
}

export default function RecipeDetails({ recipe }: Props) {
  const { t } = useTranslation();
  const description = useMemo(() => {
    if (recipe && recipe.description) {
      let descr = recipe.description;
      // Get the type of descr
      if (typeof descr === "string") {
        descr = JSON.parse(descr);
      }
      return generateHTML(descr, renderExtensions);
    }
    return "";
  }, [recipe]);

  const instructions = useMemo(() => {
    if (recipe && recipe.instructions) {
      let instr = recipe.instructions;
      // Get the type of descr
      if (typeof instr === "string") {
        instr = JSON.parse(instr);
      }
      return generateHTML(instr, editorExtensions);
    }
    return "";
  }, [recipe]);

  const notes = useMemo(() => {
    if (recipe && recipe.notes) {
      let notesParsed = recipe.notes;
      // Get the type of descr
      if (typeof notesParsed === "string") {
        notesParsed = JSON.parse(notesParsed);
      }
      return generateHTML(notesParsed, editorExtensions);
    }
    return "";
  }, [recipe]);

  const getRecipeDaysOfWeek = (daysOfWeek: string) => {
    switch (daysOfWeek) {
      case "ALL":
        return t("Todos los días");
      case "WEEKDAYS":
        return t("Entre semana");
      case "WEEKENDS":
        return t("Fin de semana");
      default:
        return t("Todos");
    }
  };

  return (
    <>
      <Grid.Col span={24}>
        <Group>
          <Text>
            <Rating value={recipe.preference} readOnly />
          </Text>
          <Text>/</Text>
          <Text>
            <Rating
              value={recipe.difficulty}
              readOnly
              emptySymbol={<IconFlame size="1.2rem" color="gray" />}
              fullSymbol={<IconFlame size="1.2rem" color="red" />}
            />
          </Text>
          <Text>/</Text>
          <Title order={5}>
            <IconClock />
          </Title>
          <Text>/</Text>
          <Text>{recipe.preparationTime}</Text>
          <Text>/</Text>
          <Title order={5}>
            <IconUsers />
          </Title>
          <Text>{recipe.servings}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col md={16} sm={24}>
        <Paper shadow="xs" p="md">
          <Grid columns={24}>
            <Grid.Col span={24}>
              <Group position="apart">
                {recipe.active ? (
                  <Badge color="teal">{t("Activa")}</Badge>
                ) : (
                  <Badge color="red">{t("Inactiva")}</Badge>
                )}
                <Link to={`/recipes/${recipe.id}/edit`}>
                  <IconEdit />
                </Link>
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col md={9} order={2} orderSm={2} orderLg={1}>
              <Stack>
                <Text>
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </Text>
                <Title order={5}>{t("Ingredientes")}</Title>
                <List>
                  {recipe.ingredients.map((ingredient: IIngredient) => (
                    <List.Item key={ingredient.id}>
                      {ingredient.product.name}: {ingredient.quantity}
                    </List.Item>
                  ))}
                </List>
                <Title order={5}>Instrucciones</Title>
                <div dangerouslySetInnerHTML={{ __html: instructions }} />
                {recipe.sides && recipe.sides.length > 0 && (
                  <>
                    <Title order={5}>{t("Acompañamientos")}</Title>
                    <List>
                      {recipe.sides.map((side: IIngredient) => (
                        <List.Item key={side.id}>
                          {side.product.name}: {side.quantity}
                        </List.Item>
                      ))}
                    </List>
                  </>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col md={3} order={1} orderSm={1} orderLg={2}>
              <Image
                maw="auto"
                mx="auto"
                radius="md"
                src={recipe.image}
                alt={t<string>("Imagen de la receta")}
                withPlaceholder
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col sm={24} md={6}>
        <Stack>
          <Title order={5}>{t("Detalles")}</Title>
          {recipe.meal === "LUNCH" && (
            <>
              <Text>
                {recipe.preferedMeal === "LUNCH"
                  ? t("Preferida para comer")
                  : t("Preferida para cenar")}
              </Text>
              <Text>
                {recipe.isOnlyLunch
                  ? t("Sólo para comer")
                  : t("Para comer y cenar")}
              </Text>
            </>
          )}
          {recipe.meal === "DINNER" && (
            <Text>
              {recipe.isOnlyDinner
                ? t("Sólo para cenar")
                : t("Para comer y cenar")}
            </Text>
          )}

          <Title order={5}>{t("Días")}</Title>
          <Text>{getRecipeDaysOfWeek(recipe.daysOfWeek)}</Text>

          <Title order={5}>{t("Estaciones")}</Title>
          <Group>
            <Badge color={recipe.seasonSpring ? "teal" : "red"}>
              {t("Primavera")}
            </Badge>
            <Badge color={recipe.seasonSummer ? "teal" : "red"}>
              {t("Verano")}
            </Badge>
            <Badge color={recipe.seasonAutumn ? "teal" : "red"}>
              {t("Otoño")}
            </Badge>
            <Badge color={recipe.seasonWinter ? "teal" : "red"}>
              {t("Invierno")}
            </Badge>
          </Group>

          <Title order={5}>{t("Temperatura")}</Title>
          <Text>
            {recipe.mealTemp === "WARM" ? (
              <Text color="#fa5252">{t("Caliente")}</Text>
            ) : (
              <Text color="#228be6">{t("Fría")}</Text>
            )}
          </Text>
          {notes && (
            <>
              <Title order={5}>{t("Notas")}</Title>
              <Paper color="purple" shadow="xs" p="md">
                <div dangerouslySetInnerHTML={{ __html: notes }} />
              </Paper>
            </>
          )}
        </Stack>
      </Grid.Col>
    </>
  );
}
