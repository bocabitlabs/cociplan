import { useTranslation } from "react-i18next";
import { Grid, Paper } from "@mantine/core";
import ProductsList from "./components/ProductList/ProductList";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import routes from "routes";

export default function ProductsPage() {
  const { t } = useTranslation();
  return (
    <Grid columns={12}>
      <Grid.Col span={12}>
        <PageTitle header={t("Products")} backRoute={`/${routes.homeRoute}`} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Paper shadow="xs" p="md">
          <ProductsList />
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
