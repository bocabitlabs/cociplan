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

export default function AddProductButton() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isLoading, isSuccess } = useAddProduct();

  const productTypes = [
    { value: "OTHER", label: t("Other") },
    { value: "EGG_MILK_PRODUCTS", label: t("Egg and milk products") },
    { value: "FATS_OILS", label: t("Fats and oils") },
    { value: "FRUITS", label: t("Fruits") },
    { value: "GRAIN_NUTS_BAKING", label: t("Grain, nuts and baking") },
    { value: "HERBS_SPICES", label: t("Herbs and spices") },
    { value: "MEAT_SASUAGE", label: t("Meat and sausages") },
    { value: "FISH", label: t("Fish") },
    { value: "PASTA_RICE", label: t("Pasta and rice") },
    { value: "VEGETABLES", label: t("Vegetables") },
    { value: "LEGUMES", label: t("Legumes") },
  ];

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
              placeholder={t<string>("Rice, milk, pasta...")}
              required
              {...form.getInputProps("name")}
            />

            <NativeSelect
              label={t("Tipo")}
              withAsterisk
              description={t<string>("Choose a type for the product")}
              data={productTypes}
              {...form.getInputProps("type")}
              required
            />

            <Group mt="md">
              <Button type="submit">{t("Create")}</Button>
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
