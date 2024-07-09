import { useTranslation } from "react-i18next";
import { Group, Rating, Text } from "@mantine/core";
import { IconClock, IconFlame, IconUsers } from "@tabler/icons-react";
import { IRecipe } from "types/recipes";

interface IProps {
  recipe: IRecipe;
}
export default function RecipeHeader({ recipe }: IProps) {
  const { t } = useTranslation();
  const { preference, difficulty, preparationTime, servings } = recipe;
  console.log(preference, difficulty, preparationTime, servings);
  return (
    <Group>
      {t("Preferencia: ")}
      <Rating value={preference} readOnly />
      <Text>/</Text>
      {t("Dificultad: ")}
      <Rating
        value={difficulty}
        readOnly
        emptySymbol={<IconFlame size="1.2rem" color="gray" />}
        fullSymbol={<IconFlame size="1.2rem" color="red" />}
      />
      <Text>/</Text>
      <Text>
        <IconClock /> {t("Tiempo: ")}
        {preparationTime}
      </Text>
      <Text>/</Text>
      <Text>
        <IconUsers />
        {t("Comensales: ")}
        {servings}
      </Text>
    </Group>
  );
}
