import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Title, Text } from "@mantine/core";
import { IconCooker } from "@tabler/icons-react";
import { generateHTML } from "@tiptap/core";
import { IRecipe } from "types/recipes";
import { editorExtensions } from "utils/editor";

interface IProps {
  recipe: IRecipe;
}

export default function RecipeExtraInfo({ recipe }: IProps) {
  const { t } = useTranslation();
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
  console.log(recipe);
  console.log(notes);
  console.log(t);

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
    <Stack>
      <Title order={5}>{t("Detalles")}</Title>
      {recipe.isOvenRecipe && (
        <Text>
          <IconCooker /> {t("Receta de horno")}
        </Text>
      )}
      {/* {recipe.meal === "LUNCH" && (
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
          {recipe.isOnlyDinner ? t("Sólo para cenar") : t("Para comer y cenar")}
        </Text>
      )} */}

      <Title order={5}>{t("Días")}</Title>
      <Text>{getRecipeDaysOfWeek(recipe.daysOfWeek)}</Text>

      {/* <Title order={5}>{t("Estaciones")}</Title>
      <Group>
        <Badge color={recipe.seasonSpring ? "teal" : "red"}>
          {t("Primavera")}
        </Badge>
        <Badge color={recipe.seasonSummer ? "teal" : "red"}>
          {t("Verano")}
        </Badge>
        <Badge color={recipe.seasonAutumn ? "teal" : "red"}>{t("Otoño")}</Badge>
        <Badge color={recipe.seasonWinter ? "teal" : "red"}>
          {t("Invierno")}
        </Badge>
      </Group>

      <Title order={5}>{t("Temperatura")}</Title>
      <Text>
        {recipe.mealTemp === "WARM" ? (
          <Text style={{ color: "#fa5252" }}>{t("Caliente")}</Text>
        ) : (
          <Text style={{ color: "#228be6" }}>{t("Fría")}</Text>
        )}
      </Text>
      {notes && (
        <>
          <Title order={5}>{t("Notas")}</Title>
          <Paper color="purple" shadow="xs" p="md">
            <div dangerouslySetInnerHTML={{ __html: notes }} />
          </Paper>
        </>
      )} */}
    </Stack>
  );
}
