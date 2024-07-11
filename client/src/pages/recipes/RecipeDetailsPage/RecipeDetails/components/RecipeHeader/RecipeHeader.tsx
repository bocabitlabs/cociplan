import { useTranslation } from "react-i18next";
import { Center, Group, Rating, Text } from "@mantine/core";
import { IconClock, IconFlame, IconUsers } from "@tabler/icons-react";
import { IRecipe } from "types/recipes";

interface IProps {
  recipe: IRecipe;
}
export default function RecipeHeader({ recipe }: IProps) {
  const { t } = useTranslation();
  const { preference, difficulty, preparationTime, servings } = recipe;
  return (
    <Group>
      <Center>
        {t("Preference: ")}
        <Rating value={preference} readOnly />
      </Center>
      <Text>/</Text>
      <Center>
        {t("Difficulty: ")}
        <Rating
          value={difficulty}
          readOnly
          emptySymbol={<IconFlame size="1.2rem" color="gray" />}
          fullSymbol={<IconFlame size="1.2rem" color="red" />}
        />
      </Center>
      <Text>/</Text>
      <Center>
        <IconClock /> {t("Cooking time: ")}
        {preparationTime}
      </Center>
      <Text>/</Text>
      <Center>
        <IconUsers />
        {t("Servings: ")}
        {servings}
      </Center>
    </Group>
  );
}
