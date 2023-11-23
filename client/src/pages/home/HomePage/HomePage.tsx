import { useTranslation } from "react-i18next";
import { Grid, Paper } from "@mantine/core";
import { IconChefHat } from "@tabler/icons-react";
import WeeklyMenusList from "../components/WeeklyMenusList/WeeklyMenusList";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";

export default function MenusPage() {
  const { t } = useTranslation();
  return (
    <Grid>
      <Grid.Col>
        <PageTitle
          header={t("Weekly menus")}
          icon={<IconChefHat color="#228be6" size={44} />}
        />
      </Grid.Col>
      <Grid.Col>
        <Paper shadow="xs" p="md">
          <WeeklyMenusList />
        </Paper>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
