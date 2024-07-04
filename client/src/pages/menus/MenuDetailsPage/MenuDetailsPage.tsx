import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, Stack } from "@mantine/core";
import { DayCard } from "./components/DayCard/DayCard";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useWeeklyMenu } from "hooks/weekly-menus/use-weekly-menus";

export default function MenuDetailsPage() {
  const { menuId } = useParams();
  const menuIdNumber = menuId ? parseInt(menuId, 10) : undefined;
  const { data, isLoading, error } = useWeeklyMenu(menuIdNumber);
  const { t } = useTranslation();

  const items = [
    { title: t("Inicio"), href: "/" },
    { title: data ? data.name : t("Cargando..."), href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  if (isLoading) return <div>{t("Cargando...")}</div>;

  if (error) return <div>{t("Error")}</div>;

  if (data) {
    return (
      <Grid columns={12}>
        <Grid.Col span={12}>
          <Breadcrumbs>{items}</Breadcrumbs>

          <PageTitle
            header={data ? data.name : t("Cargando...")}
            withBackButton
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Stack>
            <Grid>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Lunes")}
                  dailyMenu={data?.mondayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Martes")}
                  dailyMenu={data?.tuesdayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Miércoles")}
                  dailyMenu={data?.wednesdayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Jueves")}
                  dailyMenu={data?.thursdayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Viernes")}
                  dailyMenu={data?.fridayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Sábado")}
                  dailyMenu={data?.saturdayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <DayCard
                  dayName={t<string>("Domingo")}
                  dailyMenu={data?.sundayMenu}
                  weeklyMenuId={data?.id}
                />
              </Grid.Col>
            </Grid>
          </Stack>
          <Footer />
        </Grid.Col>
      </Grid>
    );
  }
  return null;
}
