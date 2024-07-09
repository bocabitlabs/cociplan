/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useAddProduct } from "hooks/products/use-products";

const productTypes = [
  { value: "OTHER", label: "Otro" },
  { value: "EGG_MILK_PRODUCTS", label: "Productos lacteos y huevos" },
  { value: "FATS_OILS", label: "Grasas y aceites" },
  { value: "FRUITS", label: "Frutas" },
  { value: "GRAIN_NUTS_BAKING", label: "Cereales, frutos secos y panaderia" },
  { value: "HERBS_SPICES", label: "Hierbas y especias" },
  { value: "MEAT_SASUAGE", label: "Carne y embutidos" },
  { value: "FISH", label: "Pescado" },
  { value: "PASTA_RICE", label: "Pasta y arroz" },
  { value: "VEGETABLES", label: "Verduras" },
  { value: "LEGUMES", label: "Legumbres" },
];

export default function AddProductButton() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isLoading, isSuccess } = useAddProduct();

  const form = useForm({
    initialValues: {
      name: "",
      type: "OTHER",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      close();
    }
  }, [isSuccess, form, close]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={t("Add product")}
        centered
        size="md"
      >
        <Box>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Text>{t("PRODUCT_FORM_HELP_TEXT")}</Text>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
              withAsterisk
              label={t("Name")}
              placeholder={t<string>("Arroz, leche, pasta...")}
              required
              {...form.getInputProps("name")}
            />

            <NativeSelect
              label={t("Tipo")}
              withAsterisk
              description={t<string>("Elije un tipo de producto")}
              data={productTypes}
              {...form.getInputProps("type")}
              required
            />

            <Group mt="md">
              <Button type="submit">{t("Crear")}</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Button leftSection={<IconPlus size="1rem" />} onClick={open}>
        {t("Add new product")}
      </Button>
    </>
  );
}
