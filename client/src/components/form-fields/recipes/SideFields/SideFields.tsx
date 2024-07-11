import { useTranslation } from "react-i18next";
import { ActionIcon, Button, Group, Select, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useSides } from "hooks/recipes/use-recipes";
import { IRecipe } from "types/recipes";

type Props = { form: any };

export default function SideFields({ form }: Props) {
  const { t } = useTranslation();
  const { data: sides, isLoading } = useSides();

  const generateSidesFields = () => {
    const options = sides.map((side: IRecipe) => ({
      value: side.id.toString(),
      label: side.name,
    }));

    const fields = form.values.sides.map((item: any, index: number) => (
      <Group key={item.key} mt="xs">
        <Select
          withAsterisk
          searchable
          placeholder={t<string>("Choose a side")}
          data={options}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps(`sides.${index}.id`)}
          required
          mt="md"
        />

        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("sides", index)}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Group>
    ));
    return fields;
  };
  if (isLoading) return <div>{t("Loading sides...")}</div>;
  return (
    <>
      {" "}
      <Text fz="lg" mt="md">
        {t("Sides")}
      </Text>
      {generateSidesFields()}
      <Group mt="md">
        <Button
          onClick={() =>
            form.insertListItem("sides", {
              id: "0",
              key: randomId(),
            })
          }
        >
          {t("Add new side")}
        </Button>
      </Group>
    </>
  );
}
