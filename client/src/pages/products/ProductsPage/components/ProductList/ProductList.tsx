import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import AddProductButton from "../AddProductButton/AddProductButton";
import InitializeProductsButton from "../InitializeProductsButton/InitializeProductsButton";
import { useDeleteProduct, useProducts } from "hooks/products/use-products";
import { IProduct } from "types/products";

export default function ProductsList() {
  const { data } = useProducts();
  const { mutate } = useDeleteProduct();
  const { t } = useTranslation();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState({ id: "", name: "" });

  const handleOpenModal = (menuId: string, menuName: string) => {
    setSelectedProduct({ id: menuId, name: menuName });
    open();
  };

  const handleCloseModal = () => {
    setSelectedProduct({ id: "", name: "" });
    close();
  };

  const handleDelete = (id: number) => {
    mutate(id);
    handleCloseModal();
  };

  return (
    <Stack>
      <Group>
        <AddProductButton />
        <InitializeProductsButton />
      </Group>
      <Table>
        <thead>
          <tr>
            <th>{t("Name")}</th>
            <th>{t("Type")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((product: IProduct) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{t(product.type)}</td>
                <td>
                  <ActionIcon color="red" title={t("Borrar producto")}>
                    <IconTrash
                      onClick={() => handleOpenModal(product.id, product.name)}
                    />
                  </ActionIcon>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Borrar producto">
        <Stack>
          <Text>Estas seguro de que quieres borrar el producto?</Text>
          <Text weight={500} mt="sm">
            {t(selectedProduct.name)}
          </Text>
          <Group>
            <Button onClick={() => handleDelete(+selectedProduct.id)}>
              Sí, borrar menù
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
