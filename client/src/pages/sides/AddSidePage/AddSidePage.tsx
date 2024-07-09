import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, Paper } from "@mantine/core";
import AddSideForm from "./components/AddSideForm/AddSideForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";

export default function AddSidePage() {
  const items = [
    { title: "Inicio", href: "../.." },
    { title: "Sides", href: ".." },
    { title: "Añadir", href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));
  const { t } = useTranslation();
  return (
    <Grid columns={24}>
      <Grid.Col span={24}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <PageTitle header={t<string>("Añadir Acompañamiento")} />
      </Grid.Col>
      <Grid.Col span={24}>
        <Paper shadow="xs" p="md">
          <AddSideForm />
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
