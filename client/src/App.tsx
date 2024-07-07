import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LanguageSelector from "components/LanguageSelector/LanguageSelector";
import Logo from "components/Logo/Logo";
import NavigationLinks from "components/NavigationLinks/NavigationLinks";
import ToggleThemeButton from "components/ToggleThemeButton/ToggleThemeButton";

function App() {
  const [opened, { toggle, close }] = useDisclosure();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const location = useLocation();
  useEffect(() => {
    close();
  }, [close, location]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger onClick={toggle} hiddenFrom="sm" size="sm" />
            <Logo />
          </Group>
          <Group>
            <LanguageSelector />
            <ToggleThemeButton />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar hidden={!opened} p="md">
        <AppShell.Section my="md" component={ScrollArea}>
          <NavigationLinks />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          backgroundColor: colorScheme === "dark" ? "" : theme.colors.gray[0],
        }}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
