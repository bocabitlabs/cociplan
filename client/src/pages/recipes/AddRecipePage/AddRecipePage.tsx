import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid } from "@mantine/core";
import AddEditRecipeForm from "../components/AddEditRecipeForm/AddEditRecipeForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import routes from "routes";

export default function AddRecipePage() {
  const { t } = useTranslation();
  const items = [
    { title: t("Home"), href: "../.." },
    { title: t("Recipes"), href: ".." },
    { title: t("Add"), href: "." },
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
        <PageTitle
          header={t("Recipes")}
          backRoute={`/${routes.recipesRoute}`}
        />
      </Grid.Col>
      <Grid.Col span={24}>
        <AddEditRecipeForm />
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
