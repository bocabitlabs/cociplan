import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  Anchor,
  Box,
  Breadcrumbs,
  Grid,
  LoadingOverlay,
  Stack,
} from "@mantine/core";
import { DayCard } from "./components/DayCard/DayCard";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useWeeklyMenu } from "hooks/weekly-menus/use-weekly-menus";
import routes from "routes";

export default function MenuDetailsPage() {
  const { menuId } = useParams();
  const menuIdNumber = menuId ? parseInt(menuId, 10) : undefined;
  const { data, isLoading, error } = useWeeklyMenu(menuIdNumber);
  const { t } = useTranslation();

  const items = [
    { title: t("Home"), href: "/" },
    { title: data ? data.name : t("Loading..."), href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  if (error) return <div>{t("Error")}</div>;

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {data && (
        <Grid>
          <Grid.Col>
            <Breadcrumbs>{items}</Breadcrumbs>
            <PageTitle
              header={data.name}
              withBackButton
              backRoute={`/${routes.homeRoute}`}
            />
          </Grid.Col>
          <Grid.Col>
            <Stack>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Monday")}
                    dayNameEnglish="Monday"
                    dailyMenu={data.mondayMenu}
                    weeklyMenuId={data?.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Tuesday")}
                    dayNameEnglish="Tuesday"
                    dailyMenu={data.tuesdayMenu}
                    weeklyMenuId={data?.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Wednesday")}
                    dayNameEnglish="Wednesday"
                    dailyMenu={data.wednesdayMenu}
                    weeklyMenuId={data.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Thursday")}
                    dayNameEnglish="Thursday"
                    dailyMenu={data.thursdayMenu}
                    weeklyMenuId={data.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Friday")}
                    dayNameEnglish="Friday"
                    dailyMenu={data.fridayMenu}
                    weeklyMenuId={data.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Saturday")}
                    dayNameEnglish="Saturday"
                    dailyMenu={data.saturdayMenu}
                    weeklyMenuId={data.id}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <DayCard
                    dayName={t<string>("Sunday")}
                    dayNameEnglish="Sunday"
                    dailyMenu={data.sundayMenu}
                    weeklyMenuId={data.id}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
            <Footer />
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
}
