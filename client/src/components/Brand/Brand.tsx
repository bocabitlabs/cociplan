import {
  Box,
  Burger,
  Group,
  MediaQuery,
  useMantineColorScheme,
} from "@mantine/core";
import Logo from "components/Logo/Logo";

export default function Brand({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Function;
}) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
      })}
    >
      <Group position="apart">
        <Group>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o: any) => !o)}
              size="sm"
              // color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Logo colorScheme={colorScheme} />
        </Group>
      </Group>
    </Box>
  );
}
