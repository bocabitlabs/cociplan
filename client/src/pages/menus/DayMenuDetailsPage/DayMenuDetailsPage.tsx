/* eslint-disable react/no-danger */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Anchor, Breadcrumbs, Grid, Title } from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import RecipeDetails from "components/RecipeDetails/RecipeDetails";
import { useRecipe } from "hooks/recipes/use-recipes";
import { useWeeklyMenu } from "hooks/weekly-menus/use-weekly-menus";
import { IDailyMenu } from "types/weekly-menus";

export default function DayMenuDetailsPage() {
  const { menuId, dayName } = useParams();
  const { data, isFetching } = useWeeklyMenu(menuId);
  const { t } = useTranslation();

  const [dayMenu, setDayMenu] = useState<IDailyMenu | null>(null);

  const { data: lunchRecipe } = useRecipe(dayMenu?.lunchRecipe.id);
  const { data: dinnerRecipe } = useRecipe(dayMenu?.dinnerRecipe.id);

  const items = [
    { title: t("Inicio"), href: "/" },
    { title: data ? data.name : t("Cargando..."), href: ".." },
    { title: dayName, href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    if (data) {
      switch (dayName) {
        case "Lunes":
          setDayMenu(data.mondayMenu);
          break;
        case "Martes":
          setDayMenu(data.tuesdayMenu);
          break;
        case "Miércoles":
          setDayMenu(data.wednesdayMenu);
          break;
        case "Jueves":
          setDayMenu(data.thursdayMenu);
          break;
        case "Viernes":
          setDayMenu(data.fridayMenu);
          break;
        case "Sábado":
          setDayMenu(data.saturdayMenu);
          break;
        case "Domingo":
          setDayMenu(data.sundayMenu);
          break;
        default:
          break;
      }
    }
  }, [data, dayName]);

  if (isFetching) return <div>Cargando...</div>;

  return (
    <Grid columns={24}>
      <Grid.Col span={24}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <PageTitle
          header={`${data ? data.name : t("cargando...")} - ${dayName}`}
          withBackButton
        />
      </Grid.Col>
      <Grid.Col span={24}>
        <Title order={2}>{t("Comida")}</Title>
        <Title order={3}>{lunchRecipe?.name}</Title>
      </Grid.Col>

      {lunchRecipe && <RecipeDetails recipe={lunchRecipe} />}
      <Grid.Col span={24}>
        <Title order={2}>Cena</Title>
        <Title order={3}>{dinnerRecipe?.name}</Title>
      </Grid.Col>
      {dinnerRecipe && <RecipeDetails recipe={dinnerRecipe} />}
      <Grid.Col span={24}>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
