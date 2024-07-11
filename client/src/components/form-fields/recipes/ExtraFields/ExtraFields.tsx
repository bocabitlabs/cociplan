import { useTranslation } from "react-i18next";
import { Group, NumberInput, Rating, Text } from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";

type Props = { form: any };

export default function ExtraFields({ form }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Group>
        <Text fz="md" mt="md">
          {t("Preference")}
        </Text>
        <Rating
          value={form.values.preference}
          fractions={2}
          defaultValue={1.5}
          onChange={(value: any) => form.setFieldValue("preference", value)}
          mt="md"
        />
        <Text fz="md" mt="md">
          {t("Difficulty")}
        </Text>
        <Rating
          value={form.values.difficulty}
          fractions={2}
          defaultValue={1.5}
          onChange={(value: any) => form.setFieldValue("difficulty", value)}
          emptySymbol={<IconFlame size="1.2rem" color="gray" />}
          fullSymbol={<IconFlame size="1.2rem" color="red" />}
          mt="md"
        />
      </Group>
      <NumberInput
        defaultValue={20}
        placeholder="15, 30, 60..."
        label={t("Cooking time (minutes)")}
        withAsterisk
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps("preparationTime")}
        mt="md"
      />
      <NumberInput
        label={t("Servings")}
        defaultValue={2}
        placeholder={t<string>("Number of servings")}
        withAsterisk
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps("servings")}
        mt="md"
      />
    </>
  );
}
