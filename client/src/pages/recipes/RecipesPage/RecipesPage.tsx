import { Grid, Paper } from "@mantine/core";
import RecipeList from "./components/RecipeList/RecipeList";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";

export default function RecipesPage() {
  return (
    <Grid>
      <Grid.Col>
        <PageTitle header="Recetas" />
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
