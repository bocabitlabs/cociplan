import { useTranslation } from "react-i18next";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconCalendar, IconChevronDown, IconPlus } from "@tabler/icons-react";
import {
  useAddWeeklyMenu,
  useAddWeeklyMenuClassic,
} from "hooks/weekly-menus/use-weekly-menus";

export default function CreateWeeklyMenuButton() {
  const { mutate, isLoading } = useAddWeeklyMenu();
  const { mutate: createClassicMenu, isLoading: isCreatingClassicMenu } =
    useAddWeeklyMenuClassic();
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const handleClick = () => {
    mutate();
  };

  return (
    <Group wrap="nowrap" gap={0}>
      <Button
        leftSection={<IconPlus size="1rem" />}
        loading={isLoading || isCreatingClassicMenu}
        onClick={handleClick}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {t("Create weekly menu")}
      </Button>
      <Menu
        transitionProps={{ transition: "pop" }}
        position="bottom-start"
        withinPortal
      >
        <Menu.Target>
          <ActionIcon
            variant="filled"
            color={theme.primaryColor}
            size={36}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <IconChevronDown
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconCalendar
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.blue[5]}
              />
            }
            onClick={() => createClassicMenu()}
            disabled={isCreatingClassicMenu || isLoading}
          >
            {t("Create weekly menu (classic)")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
