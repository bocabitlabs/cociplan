/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from "react";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useUpdateDailyMenu } from "hooks/daily-menus/use-daily-menus";
import { useRecipes } from "hooks/recipes/use-recipes";
import { IRecipe } from "types/recipes";
import { IDailyMenu } from "types/weekly-menus";

interface DayCardProps {
  dayName: string | undefined;
  dailyMenu: IDailyMenu | undefined;
  weeklyMenuId: number | undefined;
}

export function DayCard({ dailyMenu, dayName, weeklyMenuId }: DayCardProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const { t } = useTranslation();
  const { data: recipes } = useRecipes();
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

  useEffect(() => {
    if (dailyMenu) {
      form.setValues({
        lunchRecipe: dailyMenu?.lunchRecipe.id,
        dinnerRecipe: dailyMenu?.dinnerRecipe.id,
      });
    }
  }, [dailyMenu, form]);

  return (
    <>
      <Card shadow="sm">
        <Card.Section>
          <Image src={dailyMenu?.lunchRecipe.image} height={160} alt="Recipe" />
        </Card.Section>
        <Group justify="space-around" mt="md" mb="xs">
          <Title order={3}>{dayName}</Title>
          <ActionIcon onClick={open}>
            <IconEdit />
          </ActionIcon>
        </Group>

        <Stack gap="xs" align="center">
          <Text c="dimmed" fz="sm">
            {t("Lunch")}
          </Text>
          <Text>{dailyMenu?.lunchRecipe && dailyMenu?.lunchRecipe.name}</Text>
          <Text c="dimmed" fz="sm">
            {t("Dinner")}
          </Text>
          <Text>{dailyMenu?.dinnerRecipe && dailyMenu?.dinnerRecipe.name}</Text>
        </Stack>
        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          to={`${dayName}`}
          component={Link}
        >
          {t("Go to day's menu")}
        </Button>
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
