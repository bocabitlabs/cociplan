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
  LoadingOverlay,
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
import { getRecipeTypeLabel } from "pages/recipes/recipe-types";
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
      <Group justify="space-between">
        <Button
          onClick={() => navigate(routes.recipesAddRoute)}
          leftSection={<IconPlus />}
        >
          {t("Add new recipe")}
        </Button>
        <InitializeRecipesButton />
      </Group>
      {data && (
        <Table>
          <LoadingOverlay
            visible={isLoadindRecipes || isLoadingDelete}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Table.Thead>
            <Table.Tr>
              {isMobile && <Table.Th>{t("Image")}</Table.Th>}
              <Table.Th>{t("Name")}</Table.Th>
              <Table.Th>{t("Type")}</Table.Th>
              <Table.Th>{t("Meal")}</Table.Th>
              {isMobile && <Table.Th>{t("Seasons")}</Table.Th>}
              <Table.Th>{t("Actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((recipe: IRecipe) => (
              <Table.Tr key={recipe.id}>
                {isMobile && (
                  <Table.Td>
                    <Image
                      src={recipe.image}
                      alt={recipe.name}
                      fallbackSrc="https://placehold.co/80x80?text=Placeholder"
                      h={80}
                      w="auto"
                      fit="contain"
                    />
                  </Table.Td>
                )}
                <Table.Td>
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
                </Table.Td>
                <Table.Td>{getRecipeTypeLabel(recipe.type)}</Table.Td>
                <Table.Td>
                  {recipe.meal === "LUNCH" ? <IconSunHigh /> : <IconMoon />}
                </Table.Td>
                {isMobile && (
                  <Table.Td>
                    {recipe.seasonSpring && <IconFlower color="teal" />}{" "}
                    {recipe.seasonSummer && <IconSun color="#f76707" />}
                    {recipe.seasonAutumn && <IconLeaf color="brown" />}
                    {recipe.seasonWinter && <IconSnowman color="gray" />}
                  </Table.Td>
                )}
                <Table.Td>
                  <Group>
                    <ActionIcon color="red" title="Borrar receta">
                      <IconTrash
                        onClick={() => handleOpenModal(recipe.id, recipe.name)}
                      />
                    </ActionIcon>
                    <ActionIcon title="Editar receta">
                      <IconEdit onClick={() => navigate(`${recipe.id}/edit`)} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <Modal opened={opened} onClose={close} title="Borrar receta">
        <Stack>
          <Text>Estas seguro de que quieres borrar la receta?</Text>
          <Text mt="sm">{selectedRecipe.name}</Text>
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
