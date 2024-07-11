import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Title, Text, Paper, Group, Badge } from "@mantine/core";
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

  const getRecipeDaysOfWeek = (daysOfWeek: string) => {
    switch (daysOfWeek) {
      case "ALL":
        return t("All days");
      case "WEEKDAYS":
        return t("Weekdays");
      case "WEEKENDS":
        return t("Weekends");
      default:
        return t("All days");
    }
  };
  return (
    <Stack>
      <Title order={5}>{t("Details")}</Title>
      {recipe.isOvenRecipe && (
        <Text>
          <IconCooker /> {t("Oven recipe")}
        </Text>
      )}
      {recipe.meal === "LUNCH" && (
        <>
          <Text>
            {recipe.preferedMeal === "LUNCH"
              ? t("Prefered for lunch")
              : t("Prefered for dinner")}
          </Text>
          <Text>
            {recipe.isOnlyLunch
              ? t("Only for lunch")
              : t("For lunch and dinner")}
          </Text>
        </>
      )}
      {recipe.meal === "DINNER" && (
        <Text>
          {recipe.isOnlyDinner
            ? t("Only for dinner")
            : t("For lunch and dinner")}
        </Text>
      )}

      <Title order={5}>{t("Days")}</Title>
      <Text>{getRecipeDaysOfWeek(recipe.daysOfWeek)}</Text>

      <Title order={5}>{t("Seasons")}</Title>
      <Group>
        <Badge color={recipe.seasonSpring ? "teal" : "red"}>
          {t("Spring")}
        </Badge>
        <Badge color={recipe.seasonSummer ? "teal" : "red"}>
          {t("Summer")}
        </Badge>
        <Badge color={recipe.seasonAutumn ? "teal" : "red"}>
          {t("Autumn")}
        </Badge>
        <Badge color={recipe.seasonWinter ? "teal" : "red"}>
          {t("Winter")}
        </Badge>
      </Group>

      <Title order={5}>{t("Temperature")}</Title>
      <Text>
        {recipe.mealTemp === "WARM" ? (
          <Text style={{ color: "#fa5252" }}>{t("Warm")}</Text>
        ) : (
          <Text style={{ color: "#228be6" }}>{t("Cold")}</Text>
        )}
      </Text>
      {notes && (
        <>
          <Title order={5}>{t("Notes")}</Title>
          <Paper color="purple" shadow="xs" p="md">
            <div dangerouslySetInnerHTML={{ __html: notes }} />
          </Paper>
        </>
      )}
    </Stack>
  );
}
