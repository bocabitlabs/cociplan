import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  Anchor,
  Box,
  Breadcrumbs,
  Grid,
  LoadingOverlay,
  Paper,
} from "@mantine/core";
import EditSideForm from "./components/EditSideForm/EditSideForm";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";

export default function EditSidePage() {
  const { recipeId } = useParams();
  const { data, isLoading } = useRecipe(recipeId ? +recipeId : undefined);
  const { t } = useTranslation();
  const items = [
    { title: t<string>("Inicio"), href: "../../.." },
    { title: t<string>("Sides"), href: "../.." },
    { title: data?.name, href: ".." },
    { title: t<string>("Editar"), href: "." },
  ].map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Anchor component={Link} to={item.href} key={index} relative="path">
      {item.title}
    </Anchor>
  ));

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {data && (
        <Grid columns={24}>
          <Grid.Col span={24}>
            <Breadcrumbs>{items}</Breadcrumbs>
            <PageTitle header={t<string>("Editar compañamiento")} />
          </Grid.Col>
          <Grid.Col span={24}>
            <Paper shadow="xs" p="md">
              <EditSideForm recipe={data} />
            </Paper>
            <Footer />
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
}
