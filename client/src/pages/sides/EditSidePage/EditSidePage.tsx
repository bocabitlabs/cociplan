import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Anchor, Box, Breadcrumbs, Grid, LoadingOverlay } from "@mantine/core";
import { Footer } from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { useRecipe } from "hooks/recipes/use-recipes";
import AddEditRecipeForm from "pages/recipes/components/AddEditRecipeForm/AddEditRecipeForm";
import routes from "routes";

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
            <PageTitle
              header={t<string>("Edit side")}
              backRoute={`/${routes.sidesRoute}${recipeId}`}
            />
          </Grid.Col>
          <Grid.Col span={24}>
            <AddEditRecipeForm recipe={data} isSide isUpdate />
            <Footer />
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
}
