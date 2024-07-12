/* eslint-disable react/jsx-props-no-spreading */
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
import { useDisclosure, useShallowEffect } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useAddProduct } from "hooks/products/use-products";
import { IProductTypes } from "types/products-types";

export default function AddProductButton() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isLoading, isSuccess } = useAddProduct();

  const productTypes = Object.keys(IProductTypes).map((productType) => ({
    value: productType,
    label: t<string>(productType),
  }));

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

  useShallowEffect(() => {
    if (isSuccess) {
      form.reset();
      close();
    }
  }, [isSuccess, close, form]);

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
              mt="sm"
            />

            <NativeSelect
              label={t("Tipo")}
              withAsterisk
              data={productTypes}
              {...form.getInputProps("type")}
              required
              mt="sm"
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
