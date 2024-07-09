import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
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
  const { data, isLoading } = useProducts();
  const { mutate, isLoading: isLoadingDelete } = useDeleteProduct();
  const { t } = useTranslation();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number | null;
    name: string;
  }>({
    id: null,
    name: "",
  });

  const handleOpenModal = (menuId: number, menuName: string) => {
    setSelectedProduct({ id: menuId, name: menuName });
    open();
  };

  const handleCloseModal = () => {
    setSelectedProduct({ id: null, name: "" });
    close();
  };

  const handleDelete = (id: number | null) => {
    if (id === null) return;
    mutate(id);
    handleCloseModal();
  };

  return (
    <Stack>
      <Group justify="space-between">
        <AddProductButton />
        <InitializeProductsButton />
      </Group>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading || isLoadingDelete}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Box
          style={{
            display: "block",
            overflowX: "scroll",
            whiteSpace: "nowrap",
          }}
        >
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("Name")}</Table.Th>
                <Table.Th>{t("Type")}</Table.Th>
                <Table.Th>{t("Actions")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data &&
                data.map((product: IProduct) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>{t(product.type)}</Table.Td>
                    <Table.Td>
                      <ActionIcon color="red" title={t("Borrar producto")}>
                        <IconTrash
                          onClick={() =>
                            handleOpenModal(product.id, product.name)
                          }
                        />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Box>

      <Modal opened={opened} onClose={close} title="Borrar producto">
        <Stack>
          <Text>Estas seguro de que quieres borrar el producto?</Text>
          <Text fw={500} mt="sm">
            {t(selectedProduct.name)}
          </Text>
          <Group>
            <Button onClick={() => handleDelete(selectedProduct.id)}>
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
