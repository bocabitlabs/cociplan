import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Badge, Grid, Group, Paper, Image, ActionIcon } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import RecipeExtraInfo from "./components/RecipeExtraInfo/RecipeExtraInfo";
import RecipeHeader from "./components/RecipeHeader/RecipeHeader";
import RecipeInstructions from "./components/RecipeInstructions/RecipeInstructions";
import { IRecipe } from "types/recipes";
import { getStringWordsInitials, stringToColour } from "utils/string_utils";

interface Props {
  recipe: IRecipe;
}

export default function RecipeDetails({ recipe }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const openEditRecipe = () => {
    navigate(
      recipe.isSidePlate
        ? `/sides/${recipe.id}/edit`
        : `/recipes/${recipe.id}/edit`,
    );
  };

  return (
    <>
      <Grid.Col>
        <RecipeHeader recipe={recipe} />
      </Grid.Col>
      <Grid.Col span={{ md: 8, sm: 12 }}>
        <Paper shadow="xs" p="md">
          <Grid>
            <Grid.Col>
              <Group justify="space-between">
                {recipe.active ? (
                  <Badge color="teal">{t("Active")}</Badge>
                ) : (
                  <Badge color="red">{t("Innactive")}</Badge>
                )}
                <ActionIcon onClick={openEditRecipe} variant="subtle">
                  <IconEdit />
                </ActionIcon>
              </Group>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ md: 9, order: 2, orderSm: 2, orderLg: 1 }}>
              <RecipeInstructions recipe={recipe} />
            </Grid.Col>
            <Grid.Col span={{ md: 3, order: 1, orderSm: 1, orderLg: 2 }}>
              <Image
                maw="auto"
                mx="auto"
                radius="md"
                src={recipe.image?.image}
                alt={t<string>("Recipe image")}
                fallbackSrc={`https://placehold.co/200x200/${stringToColour(
                  recipe.name,
                )}/fff?text=${getStringWordsInitials(recipe.name)}`}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ md: 4, sm: 12 }}>
        <RecipeExtraInfo recipe={recipe} />
      </Grid.Col>
    </>
  );
}
