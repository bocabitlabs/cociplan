import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  Modal,
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
import {
  useDeleteWeeklyMenu,
  useUpdateWeeklyMenu,
  useWeeklyMenus,
} from "hooks/weekly-menus/use-weekly-menus";
import { IWeeklyMenu } from "types/weekly-menus";

export default function WeeklyMenusList() {
  const { data, isLoading } = useWeeklyMenus();
  const { mutate } = useDeleteWeeklyMenu();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [selectedMenu, setSelectedMenu] = useState({ id: "", name: "" });
  const { t } = useTranslation();
  const form = useForm({
    initialValues: {
      name: "",
    },
  });
  const { mutate: updateMutate } = useUpdateWeeklyMenu();
  const handleOpenModal = (menuId: string, menuName: string) => {
    setSelectedMenu({ id: menuId, name: menuName });
    open();
  };

  const handleCloseModal = () => {
    setSelectedMenu({ id: "", name: "" });
    close();
  };

  const handleDelete = (id: number) => {
    mutate(id);
    handleCloseModal();
  };

  const handleOpenEditModal = (menuId: string, menuName: string) => {
    setSelectedMenu({ id: menuId, name: menuName });
    form.setFieldValue("name", menuName);
    openEdit();
  };

  const handleCloseEditModal = () => {
    setSelectedMenu({ id: "", name: "" });
    closeEdit();
  };

  const handleUpdate = (id: string) => {
    updateMutate({ id, name: form.values.name });
    handleCloseEditModal();
  };

  if (isLoading) {
    return <div>{t("Cargando...")}</div>;
  }

  return (
    <Stack>
      <Group>
        <CreateWeeklyMenuButton />
      </Group>
      <Table>
        <thead>
          <tr>
            <th>{t("Fecha")}</th>
            <th>{t("Name")}</th>
            <th>{t("Acciones")}</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((menu: IWeeklyMenu) => (
              <tr key={menu.id}>
                <td>{dayjs(menu.dateCreated).format("DD/MM/YYYY HH:mm")}</td>
                <td>
                  <Anchor component={Link} to={`/menus/${menu.id}`}>
                    {menu.name}
                  </Anchor>
                </td>
                <td>
                  <Group>
                    <ActionIcon color="red" title={t("Borrar menu semanal")}>
                      <IconTrash
                        onClick={() => handleOpenModal(menu.id, menu.name)}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleOpenEditModal(menu.id, menu.name)}
                      title={t("Cambiar nombre")}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Borrar menú semanal">
        <Stack>
          <Text>
            {t("Estas seguro de que quieres borrar el menu semanal?")}
          </Text>
          <Text weight={500} mt="sm">
            {selectedMenu.name}
          </Text>
          <Group>
            <Button onClick={() => handleDelete(+selectedMenu.id)}>
              {t("Sí, borrar menú")}
            </Button>
            <Button onClick={handleCloseModal} variant="light">
              {t("Cancelar")}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title={t("Editar menú semanal")}
      >
        <Stack>
          <Text>
            {t("Estas seguro de que quieres borrar el menu semanal?")}
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
                  {t("Sí, actualizar")}
                </Button>
                <Button onClick={handleCloseEditModal} variant="light">
                  {t("Cancelar")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </Stack>
  );
}
