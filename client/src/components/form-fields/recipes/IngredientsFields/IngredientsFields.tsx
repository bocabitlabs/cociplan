import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Button,
  Group,
  Select,
  TextInput,
  Text,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useProductsNoLimit } from "hooks/products/use-products";
import { IProduct } from "types/products";

type Props = {
  form: any;
};

export default function IngredientsFields({ form }: Props) {
  const { t } = useTranslation();
  const { data: products, isLoading } = useProductsNoLimit();

  const fields = form
    .getValues()
    .ingredients?.map((item: any, index: number) => (
      <Group key={item.key} mt="xs">
        <Select
          withAsterisk
          searchable
          placeholder={t<string>("Choose a product")}
          data={products?.map((product: IProduct) => ({
            value: product.id.toString(),
            label: product.name,
          }))}
          key={form.key(`ingredients.${index}.product`)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps(`ingredients.${index}.product`)}
          required
        />
        <TextInput
          placeholder={t<string>("Quantity")}
          withAsterisk
          style={{ flex: 1 }}
          key={form.key(`ingredients.${index}.quantity`)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps(`ingredients.${index}.quantity`)}
        />

        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("ingredients", index)}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Group>
    ));

  if (isLoading) {
    return <div>{t("Loading ingredients...")}</div>;
  }

  return (
    <>
      <Text fz="lg" mt="md">
        {t("Ingredients")}
      </Text>

      {fields.length > 0 ? (
        fields
      ) : (
        <Text mt="md">{t("No ingredients yet")}</Text>
      )}

      <Group mt="md">
        <Button
          onClick={() =>
            form.insertListItem("ingredients", {
              product: "0",
              quantity: 0,
              key: randomId(),
            })
          }
        >
          {t("Add ingredient")}
        </Button>
      </Group>
    </>
  );
}
