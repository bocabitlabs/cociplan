import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, LoadingOverlay } from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";
import RecipeDetails from "pages/recipes/RecipeDetailsPage/RecipeDetails/RecipeDetails";

export default function RecipeDetailsPage() {
  const { recipeId } = useParams();
  const { data, isLoading } = useRecipe(recipeId ? +recipeId : undefined);
  const { t } = useTranslation();

  const items = [
    { title: "Inicio", href: "../.." },
    {
      title: data?.isSidePlate ? t<string>("Sides") : t<string>("Recetas"),
      href: "..",
    },
    { title: data?.name, href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  return (
    <Grid>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {data && (
        <>
          <Grid.Col>
            <Breadcrumbs>{items}</Breadcrumbs>
            <PageTitle header={`${data?.name}`} withBackButton />
          </Grid.Col>
          <RecipeDetails recipe={data} />
        </>
      )}
      <Grid.Col>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
