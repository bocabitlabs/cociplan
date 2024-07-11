import { useTranslation } from "react-i18next";
import { Center, Checkbox, Group, Text } from "@mantine/core";
import {
  IconFlower,
  IconLeaf,
  IconSnowman,
  IconSun,
} from "@tabler/icons-react";

type Props = { form: any };

export default function SeasonsCheckboxes({ form }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Text fz="lg" mt="md">
        {t("Seasons for the recipe")}
      </Text>
      <Group mt="xs">
        <Checkbox
          label={
            <Center inline>
              <IconFlower color="teal" />
              {t("Spring")}
            </Center>
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("seasonSpring", { type: "checkbox" })}
        />
        <Checkbox
          label={
            <Center inline>
              <IconSun color="#f76707" />
              {t("Summer")}
            </Center>
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("seasonSummer", { type: "checkbox" })}
        />
        <Checkbox
          label={
            <Center inline>
              <IconLeaf color="brown" />
              {t("Autumn")}
            </Center>
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("seasonAutumn", { type: "checkbox" })}
        />
        <Checkbox
          label={
            <Center inline>
              <IconSnowman color="gray" />
              {t("Winter")}
            </Center>
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("seasonWinter", { type: "checkbox" })}
        />
      </Group>
    </>
  );
}
