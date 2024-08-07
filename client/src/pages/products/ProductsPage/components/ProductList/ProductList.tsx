import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
  Input,
  CloseButton,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import AddProductButton from "../AddProductButton/AddProductButton";
import config from "config";
import { useDeleteProduct, useProducts } from "hooks/products/use-products";
import { IProduct } from "types/products";

export default function ProductsList() {
  const [page, setPage] = useState(1);
  const { mutate, isLoading: isLoadingDelete } = useDeleteProduct();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(t<string>(""));
  const [debouncedSearch] = useDebouncedValue(searchValue, 200);
  const { data, isLoading } = useProducts(page, debouncedSearch);

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
        <Input
          placeholder={t("Search product")}
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
          visible={isLoading || isLoadingDelete}
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
                <Table.Th>{t("Name")}</Table.Th>
                <Table.Th>{t("Type")}</Table.Th>
                <Table.Th>{t("Actions")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.results.map((product: IProduct) => (
                <Table.Tr key={product.id}>
                  <Table.Td>{product.name}</Table.Td>
                  <Table.Td>{t(product.type)}</Table.Td>
                  <Table.Td>
                    <ActionIcon color="red" title={t("Delete product")}>
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

      <Modal opened={opened} onClose={close} title={t("Delete product")}>
        <Stack>
          <Text>{t("Do you want to delete the product?")}</Text>
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
