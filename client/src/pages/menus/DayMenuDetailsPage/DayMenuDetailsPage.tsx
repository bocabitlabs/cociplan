import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  Anchor,
  Breadcrumbs,
  Grid,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";
import { useWeeklyMenu } from "hooks/weekly-menus/use-weekly-menus";
import RecipeDetails from "pages/recipes/RecipeDetailsPage/RecipeDetails/RecipeDetails";
import routes from "routes";
import { IDailyMenu } from "types/weekly-menus";

export default function DayMenuDetailsPage() {
  const { menuId, dayName } = useParams();
  const menuIdNumber = menuId ? parseInt(menuId, 10) : undefined;
  const { data, isLoading } = useWeeklyMenu(menuIdNumber);
  const { t } = useTranslation();

  const [dayMenu, setDayMenu] = useState<IDailyMenu | null>(null);

  const { data: lunchRecipe } = useRecipe(dayMenu?.lunchRecipe.id);
  const { data: dinnerRecipe } = useRecipe(dayMenu?.dinnerRecipe.id);

  const items = [
    { title: t("Home"), href: "/" },
    { title: data ? data.name : t("Loading..."), href: ".." },
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
        case "Monday":
          setDayMenu(data.mondayMenu);
          break;
        case "Tuesday":
          setDayMenu(data.tuesdayMenu);
          break;
        case "Wednesday":
          setDayMenu(data.wednesdayMenu);
          break;
        case "Thursday":
          setDayMenu(data.thursdayMenu);
          break;
        case "Friday":
          setDayMenu(data.fridayMenu);
          break;
        case "Saturday":
          setDayMenu(data.saturdayMenu);
          break;
        case "Sunday":
          setDayMenu(data.sundayMenu);
          break;
        default:
          break;
      }
    }
  }, [data, dayName]);

  return (
    <Grid>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Grid.Col>
        <Breadcrumbs>{items}</Breadcrumbs>
        <PageTitle
          header={`${data ? data.name : t("Loading...")} - ${dayName}`}
          withBackButton
          backRoute={`/${routes.menusRoute}${menuIdNumber}`}
        />
      </Grid.Col>
      <Grid.Col>
        <Title order={2}>{t("Lunch")}</Title>
        <Title order={3}>{lunchRecipe?.name}</Title>
      </Grid.Col>

      {lunchRecipe && <RecipeDetails recipe={lunchRecipe} />}
      <Grid.Col>
        <Title order={2}>{t("Dinner")}</Title>
        <Title order={3}>{dinnerRecipe?.name}</Title>
      </Grid.Col>
      {dinnerRecipe && <RecipeDetails recipe={dinnerRecipe} />}
      <Grid.Col>
        <Footer />
      </Grid.Col>
    </Grid>
  );
}
