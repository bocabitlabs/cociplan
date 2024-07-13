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
  Box,
  Pagination,
  Input,
  CloseButton,
  useMantineTheme,
} from "@mantine/core";
import {
  useDebouncedValue,
  useDisclosure,
  useMediaQuery,
} from "@mantine/hooks";
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
  IconPointFilled,
} from "@tabler/icons-react";
import config from "config";
import { useDeleteRecipe, useRecipes } from "hooks/recipes/use-recipes";
import routes from "routes";
import { IRecipe } from "types/recipes";
import { getStringWordsInitials, stringToColour } from "utils/string_utils";

interface SelectedRecipeProps {
  id: number | null;
  name: string | null;
}

export default function RecipeList() {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState(t<string>(""));
  const [debouncedSearch] = useDebouncedValue(searchValue, 200);
  const { data, isLoading: isLoadindRecipes } = useRecipes(
    page,
    debouncedSearch,
  );
  const { mutate, isLoading: isLoadingDelete } = useDeleteRecipe();
  const navigate = useNavigate();
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
        <Input
          placeholder={t("Search recipes")}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label={t("Clear input")}
              onClick={() => setSearchValue("")}
              style={{ display: searchValue ? undefined : "none" }}
            />
          }
        />
      </Group>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoadindRecipes || isLoadingDelete}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Box
          style={{
            display: "block",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                {isMobile && <Table.Th />}
                <Table.Th>{t("Name")}</Table.Th>
                <Table.Th>{t("Type")}</Table.Th>
                <Table.Th>{t("Meal")}</Table.Th>
                {isMobile && <Table.Th>{t("Seasons")}</Table.Th>}
                <Table.Th>{t("Actions")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.results.map((recipe: IRecipe) => (
                <Table.Tr key={recipe.id}>
                  <Table.Td>
                    <IconPointFilled
                      style={{
                        color: recipe.active
                          ? theme.colors.teal[5]
                          : theme.colors.red[5],
                      }}
                      aria-label={
                        recipe.active
                          ? t<string>("Active")
                          : t<string>("Inactive")
                      }
                    />
                  </Table.Td>
                  {isMobile && (
                    <Table.Td>
                      <Image
                        src={recipe.image?.image}
                        alt={recipe.name}
                        fallbackSrc={`https://placehold.co/80x80/${stringToColour(
                          recipe.name,
                        )}/fff?text=${getStringWordsInitials(recipe.name)}`}
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
                  <Table.Td>{t(recipe.type)}</Table.Td>
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
                      <ActionIcon color="red" title={t("Delete recipe")}>
                        <IconTrash
                          onClick={() =>
                            handleOpenModal(recipe.id, recipe.name)
                          }
                        />
                      </ActionIcon>
                      <ActionIcon title={t("Edit recipe")}>
                        <IconEdit
                          onClick={() => navigate(`${recipe.id}/edit`)}
                        />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Pagination
            value={page}
            onChange={setPage}
            total={
              data?.count && data.count > 0
                ? Math.floor(data.count / config.PAGE_SIZE) + 1
                : 0
            }
            mt="md"
          />
        </Box>
      </Box>

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
