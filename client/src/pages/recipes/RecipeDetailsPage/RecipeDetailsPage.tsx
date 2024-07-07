import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, LoadingOverlay } from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import RecipeDetails from "components/RecipeDetails/RecipeDetails";
import { useRecipe } from "hooks/recipes/use-recipes";

export default function RecipeDetailsPage() {
  const { recipeId } = useParams();
  const { data, isLoading } = useRecipe(recipeId ? +recipeId : undefined);

  const items = [
    { title: "Inicio", href: "../.." },
    { title: "Recetas", href: ".." },
    { title: data ? data.name : "Cargando...", href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  if (data) {
    return (
      <Grid columns={24}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Grid.Col span={24}>
          <Breadcrumbs>{items}</Breadcrumbs>
          <PageTitle
            header={`${data ? data.name : "cargando..."}`}
            withBackButton
          />
        </Grid.Col>
        {data && <RecipeDetails recipe={data} />}
        <Grid.Col span={24}>
          <Footer />
        </Grid.Col>
      </Grid>
    );
  }
  return null;
}
