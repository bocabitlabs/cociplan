import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge, Grid, Group, Paper, Image } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import RecipeExtraInfo from "./components/RecipeExtraInfo/RecipeExtraInfo";
import RecipeHeader from "./components/RecipeHeader/RecipeHeader";
import RecipeInstructions from "./components/RecipeInstructions/RecipeInstructions";
import { IRecipe } from "types/recipes";

interface Props {
  recipe: IRecipe;
}

export default function RecipeDetails({ recipe }: Props) {
  const { t } = useTranslation();

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
                  <Badge color="teal">{t("Activa")}</Badge>
                ) : (
                  <Badge color="red">{t("Inactiva")}</Badge>
                )}
                <Link
                  to={
                    recipe.isSidePlate
                      ? `/sides/${recipe.id}/edit`
                      : `/recipes/${recipe.id}/edit`
                  }
                >
                  <IconEdit />
                </Link>
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
                src={recipe.image}
                alt={t<string>("Imagen de la receta")}
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
