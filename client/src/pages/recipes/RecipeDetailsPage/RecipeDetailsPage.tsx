/* eslint-disable react/no-danger */
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid } from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import RecipeDetails from "components/RecipeDetails/RecipeDetails";
import { useRecipe } from "hooks/recipes/use-recipes";

export default function RecipeDetailsPage() {
  const { recipeId } = useParams();
  const { data, isFetching } = useRecipe(recipeId ? +recipeId : undefined);

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

  if (isFetching) return <div>Cargando...</div>;

  if (data) {
    return (
      <Grid columns={24}>
        <Grid.Col span={24}>
          <Breadcrumbs>{items}</Breadcrumbs>
          <PageTitle
            header={`${data ? data.name : "cargando..."}`}
            withBackButton
          />
        </Grid.Col>
        {isFetching && <div>Cargando receta...</div>}
        {data && <RecipeDetails recipe={data} />}
        <Grid.Col span={24}>
          <Footer />
        </Grid.Col>
      </Grid>
    );
  }
  return null;
}
