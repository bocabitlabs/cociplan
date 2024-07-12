import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, LoadingOverlay, Box } from "@mantine/core";
import AddEditRecipeForm from "../components/AddEditRecipeForm/AddEditRecipeForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";
import routes from "routes";

export default function EditRecipePage() {
  const { recipeId } = useParams();
  const { data, isLoading } = useRecipe(recipeId ? +recipeId : undefined);
  const { t } = useTranslation();
  const items = [
    { title: t("Home"), href: "../../.." },
    { title: t("Recipes"), href: "../.." },
    { title: data?.name || t("Loading..."), href: ".." },
    { title: t("Edit"), href: "." },
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
            <PageTitle
              header={t<string>("Edit recipe")}
              backRoute={`/${routes.recipesRoute}${recipeId}`}
            />
          </Grid.Col>
          <Grid.Col>
            <AddEditRecipeForm recipe={data} isUpdate />
          </Grid.Col>
        </Box>
      )}
      <Grid.Col>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
