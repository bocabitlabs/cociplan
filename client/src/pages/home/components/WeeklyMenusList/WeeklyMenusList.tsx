import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import CreateWeeklyMenuButton from "../CreateWeeklyMenuButton/CreateWeeklyMenuButton";
import config from "config";
import {
  useDeleteWeeklyMenu,
  useUpdateWeeklyMenu,
  useWeeklyMenus,
} from "hooks/weekly-menus/use-weekly-menus";
import { IWeeklyMenu } from "types/weekly-menus";

export default function WeeklyMenusList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWeeklyMenus(page);
  const { mutate } = useDeleteWeeklyMenu();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [selectedMenu, setSelectedMenu] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });
  const { t } = useTranslation();
  const form = useForm({
    initialValues: {
      name: "",
    },
  });
  const { mutate: updateMutate } = useUpdateWeeklyMenu();
  const handleOpenModal = (menuId: number, menuName: string) => {
    setSelectedMenu({ id: menuId, name: menuName });
    open();
  };

  const handleCloseModal = () => {
    setSelectedMenu({ id: null, name: "" });
    close();
  };

  const handleDelete = (id: number | null) => {
    if (id === null) {
      throw new Error("Cannot delete Weekly menu. id is null");
    }
    mutate(id);
    handleCloseModal();
  };

  const handleOpenEditModal = (menuId: number, menuName: string) => {
    setSelectedMenu({ id: menuId, name: menuName });
    form.setFieldValue("name", menuName);
    openEdit();
  };

  const handleCloseEditModal = () => {
    setSelectedMenu({ id: null, name: "" });
    closeEdit();
  };

  const handleUpdate = (id: number | null) => {
    if (id === null) {
      throw new Error(t<string>("Cannot update Weekly menu. id is null"));
    }
    updateMutate({ id, name: form.values.name });
    handleCloseEditModal();
  };

  return (
    <Stack>
      <Group>
        <CreateWeeklyMenuButton />
      </Group>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
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
                <th>{t("Date")}</th>
                <th>{t("Name")}</th>
                <th>{t("Actions")}</th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.results.map((menu: IWeeklyMenu) => (
                <Table.Tr key={menu.id}>
                  <Table.Td>
                    {dayjs(menu.dateCreated).format("DD/MM/YYYY HH:mm")}
                  </Table.Td>
                  <Table.Td>
                    <Anchor component={Link} to={`/menus/${menu.id}`}>
                      {menu.name}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon color="red" title={t("Delete weekly menu")}>
                        <IconTrash
                          onClick={() => handleOpenModal(menu.id, menu.name)}
                        />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => handleOpenEditModal(menu.id, menu.name)}
                        title={t("Change name of weekly menu")}
                      >
                        <IconEdit />
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
      <Modal opened={opened} onClose={close} title={t("Delete weekly menu")}>
        <Stack>
          <Text>{t("Are you sure you want to delete the weekly menu?")}</Text>
          <Text fw={500} mt="sm">
            {selectedMenu.name}
          </Text>
          <Group>
            <Button onClick={() => handleDelete(selectedMenu.id)}>
              {t("Yes, delete")}
            </Button>
            <Button onClick={handleCloseModal} variant="light">
              {t("Cancel")}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title={t("Edit weekly menu name")}
      >
        <Stack>
          <Text>
            {t("Are you sure you want to change the name of the weekly menu?")}
          </Text>
          <form>
            <Stack>
              <TextInput
                withAsterisk
                label={t("Name")}
                required
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...form.getInputProps("name")}
              />

              <Group>
                <Button onClick={() => handleUpdate(selectedMenu.id)}>
                  {t("Yes, change name")}
                </Button>
                <Button onClick={handleCloseEditModal} variant="light">
                  {t("Cancel")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </Stack>
  );
}
