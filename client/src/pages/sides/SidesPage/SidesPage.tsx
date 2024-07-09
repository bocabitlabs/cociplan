import { useTranslation } from "react-i18next";
import { Grid, Paper } from "@mantine/core";
import SideList from "./components/SideList/SideList";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";

export default function SidesPage() {
  const { t } = useTranslation();
  return (
    <Grid>
      <Grid.Col>
        <PageTitle header={t<string>("Sides")} />
      </Grid.Col>
      <Grid.Col>
        <Paper shadow="xs" p="md">
          <SideList />
        </Paper>
      </Grid.Col>
      <Grid.Col>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
