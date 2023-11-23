import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, Paper } from "@mantine/core";
import EditRecipeForm from "./components/EditRecipeForm/EditRecipeForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";

export default function EditRecipePage() {
  const { recipeId } = useParams();
  const { data, isFetching } = useRecipe(recipeId ? +recipeId : undefined);
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
  if (isFetching) return <div>Cargando...</div>;

  return (
    <Grid columns={24}>
      <Grid.Col span={24}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <PageTitle header="Editar receta" />
      </Grid.Col>
      <Grid.Col span={24}>
        <Paper shadow="xs" p="md">
          {data && <EditRecipeForm recipe={data} />}
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
