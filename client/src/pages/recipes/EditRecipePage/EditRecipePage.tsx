import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  Anchor,
  Breadcrumbs,
  Grid,
  LoadingOverlay,
  Paper,
  Box,
} from "@mantine/core";
import EditRecipeForm from "./components/EditRecipeForm/EditRecipeForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";

export default function EditRecipePage() {
  const { recipeId } = useParams();
  const { data, isLoading } = useRecipe(recipeId ? +recipeId : undefined);
  const { t } = useTranslation();
  const items = [
    { title: "Inicio", href: "../../.." },
    { title: "Recetas", href: "../.." },
    { title: data?.name || "Cargando...", href: ".." },
    { title: "Editar", href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  return (
    <Grid>
      {data && (
        <Box pos="relative">
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Grid.Col>
            <Breadcrumbs>{items}</Breadcrumbs>
            <PageTitle header={t<string>("Editar receta")} />
          </Grid.Col>
          <Grid.Col>
            <Paper shadow="xs" p="md">
              <EditRecipeForm recipe={data} />
            </Paper>
          </Grid.Col>
        </Box>
      )}
      <Grid.Col>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
