/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  NativeSelect,
  Stack,
  Text,
  Image,
  Title,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useUpdateDailyMenu } from "hooks/daily-menus/use-daily-menus";
import { useRecipesNoLimit } from "hooks/recipes/use-recipes";
import { IRecipe } from "types/recipes";
import { IDailyMenu } from "types/weekly-menus";
import { getStringWordsInitials, stringToColour } from "utils/string_utils";

interface DayCardProps {
  dayName: string;
  dayNameEnglish: string;
  dailyMenu: IDailyMenu;
  weeklyMenuId: number;
}

export function DayCard({
  dailyMenu,
  dayName,
  dayNameEnglish,
  weeklyMenuId,
}: DayCardProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const { t } = useTranslation();
  const { data: recipes } = useRecipesNoLimit();
  const { mutate } = useUpdateDailyMenu();

  const form = useForm({
    initialValues: {
      lunchRecipe: dailyMenu?.lunchRecipe.id,
      dinnerRecipe: dailyMenu?.dinnerRecipe.id,
    },
  });

  const onSubmit = (values: any) => {
    const newValues = values;
    newValues.dailyMenuId = dailyMenu?.id;
    newValues.weeklyMenuId = weeklyMenuId;
    console.log(newValues);
    mutate(newValues);
    close();
  };

  const getRecipesOptions = () => {
    if (!recipes) return [];

    const recipesOptions = recipes.map((recipe: IRecipe) => ({
      value: recipe.id,
      label: recipe.name,
    }));
    return recipesOptions;
  };

  return (
    <>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section>
          <Image
            src={dailyMenu?.lunchRecipe.image}
            height={160}
            alt="Recipe"
            fallbackSrc={`https://placehold.co/200x200/${stringToColour(
              dailyMenu?.lunchRecipe.name,
            )}/fff?text=${getStringWordsInitials(dailyMenu?.lunchRecipe.name)}`}
          />
        </Card.Section>
        <Card.Section>
          <Center>
            <Group justify="space-between" mt="md" mb="xs" align="center">
              <Title order={2}>{dayName}</Title>
            </Group>
          </Center>
        </Card.Section>
        <Card.Section withBorder inheritPadding py="xs">
          <Stack gap="xs" align="center">
            <Text c="dimmed" fz="sm">
              {t("Lunch")}
            </Text>
            <Text>{dailyMenu?.lunchRecipe && dailyMenu?.lunchRecipe.name}</Text>
            <Text c="dimmed" fz="sm">
              {t("Dinner")}
            </Text>
            <Text>
              {dailyMenu?.dinnerRecipe && dailyMenu?.dinnerRecipe.name}
            </Text>
          </Stack>
          <Group>
            <Button
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              to={`${dayNameEnglish}`}
              component={Link}
            >
              {t("Go to day's menu")}
            </Button>
          </Group>
        </Card.Section>
        <Card.Section withBorder inheritPadding py="xs">
          <ActionIcon
            onClick={open}
            variant="subtle"
            aria-label={t("Edit")}
            color="gray"
          >
            <IconEdit />
          </ActionIcon>
        </Card.Section>
      </Card>
      <Modal
        opened={opened}
        onClose={close}
        title={`${t(`Edit menu `)}${dayName}`}
        centered
        size="md"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <NativeSelect
            label={t("Lunch")}
            withAsterisk
            description={t<string>("Choose a recipe for lunch")}
            data={getRecipesOptions()}
            {...form.getInputProps("lunchRecipe")}
            required
          />

          <NativeSelect
            label={t("Dinner")}
            withAsterisk
            description={t<string>("Choose a recipe for dinner")}
            data={getRecipesOptions()}
            {...form.getInputProps("dinnerRecipe")}
            required
          />

          <Group mt="md">
            <Button type="submit">{t("Update")}</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default DayCard;
