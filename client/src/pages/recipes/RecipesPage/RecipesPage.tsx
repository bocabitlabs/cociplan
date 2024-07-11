import { useTranslation } from "react-i18next";
import { Grid, Paper } from "@mantine/core";
import RecipeList from "./components/RecipeList/RecipeList";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import routes from "routes";

export default function RecipesPage() {
  const { t } = useTranslation();
  return (
    <Grid>
      <Grid.Col>
        <PageTitle header={t("Recipes")} backRoute={`/${routes.homeRoute}`} />
      </Grid.Col>
      <Grid.Col>
        <Paper shadow="xs" p="md">
          <RecipeList />
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
