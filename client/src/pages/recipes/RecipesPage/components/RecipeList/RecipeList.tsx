import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Image,
  Anchor,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconFlower,
  IconLeaf,
  IconSnowman,
  IconMoon,
  IconPlus,
  IconSunHigh,
  IconTrash,
  IconSun,
  IconEdit,
} from "@tabler/icons-react";
import InitializeRecipesButton from "../InitializeRecipesButton/InitializeRecipesButton";
import { useDeleteRecipe, useRecipes } from "hooks/recipes/use-recipes";
import routes from "routes";
import { IRecipe } from "types/recipes";

interface SelectedRecipeProps {
  id: number | null;
  name: string | null;
}

export default function RecipeList() {
  const { data, isLoading: isLoadindRecipes } = useRecipes();
  const { mutate, isLoading: isLoadingDelete } = useDeleteRecipe();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRecipe, setSelectedRecipe] = useState<SelectedRecipeProps>({
    id: null,
    name: null,
  });
  const isMobile = useMediaQuery("(min-width: 768px)");

  const handleOpenModal = (menuId: number | null, menuName: string | null) => {
    setSelectedRecipe({ id: menuId, name: menuName });
    open();
  };

  const handleCloseModal = () => {
    setSelectedRecipe({ id: null, name: null });
    close();
  };

  const handleDelete = (id: number | null) => {
    if (!id) return;
    mutate(id);
    handleCloseModal();
  };

  return (
    <Stack>
      <Group>
        <Button
          onClick={() => navigate(routes.recipesAddRoute)}
          leftIcon={<IconPlus />}
        >
          {t("Add new recipe")}
        </Button>
        <InitializeRecipesButton />
      </Group>
      {isLoadindRecipes && <Text>{t("Cargando...")}</Text>}
      {data && (
        <Table>
          <thead>
            <tr>
              {isMobile && <th>{t("Image")}</th>}
              <th>{t("Name")}</th>
              <th>{t("Type")}</th>
              {isMobile && <th>{t("Seasons")}</th>}
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((recipe: IRecipe) => (
                <tr key={recipe.id}>
                  {isMobile && (
                    <td>
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        withPlaceholder
                        width={80}
                      />
                    </td>
                  )}
                  <td>
                    {recipe.active ? (
                      <strong>
                        <Anchor component={Link} to={`${recipe.id}`}>
                          {recipe.name}
                        </Anchor>
                      </strong>
                    ) : (
                      <Anchor component={Link} to={`${recipe.id}`}>
                        {recipe.name}
                      </Anchor>
                    )}
                  </td>
                  <td>
                    {recipe.meal === "LUNCH" ? <IconSunHigh /> : <IconMoon />}
                  </td>
                  {isMobile && (
                    <td>
                      {recipe.seasonSpring && <IconFlower color="teal" />}{" "}
                      {recipe.seasonSummer && <IconSun color="#f76707" />}
                      {recipe.seasonAutumn && <IconLeaf color="brown" />}
                      {recipe.seasonWinter && <IconSnowman color="gray" />}
                    </td>
                  )}
                  <td>
                    <Group>
                      <ActionIcon color="red" title="Borrar receta">
                        <IconTrash
                          onClick={() =>
                            handleOpenModal(recipe.id, recipe.name)
                          }
                        />
                      </ActionIcon>
                      <ActionIcon title="Editar receta">
                        <IconEdit
                          onClick={() => navigate(`${recipe.id}/edit`)}
                        />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <Modal opened={opened} onClose={close} title="Borrar receta">
        <Stack>
          <Text>Estas seguro de que quieres borrar la receta?</Text>
          <Text weight={500} mt="sm">
            {selectedRecipe.name}
          </Text>
          <Group>
            <Button
              loading={isLoadingDelete}
              onClick={() => handleDelete(selectedRecipe.id)}
            >
              Sí, borrar receta
            </Button>
            <Button onClick={handleCloseModal} variant="light">
              Cancelar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
