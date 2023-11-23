import { Link } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, Paper } from "@mantine/core";
import AddRecipeForm from "./components/AddRecipeForm/AddRecipeForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";

export default function AddRecipePage() {
  const items = [
    { title: "Inicio", href: "../.." },
    { title: "Recetas", href: ".." },
    { title: "Añadir", href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));
  return (
    <Grid columns={24}>
      <Grid.Col span={24}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <PageTitle header="Recetas" />
      </Grid.Col>
      <Grid.Col span={24}>
        <Paper shadow="xs" p="md">
          <AddRecipeForm />
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
