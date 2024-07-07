import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  MantineProvider,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import LanguageSelector from "components/LanguageSelector/LanguageSelector";
import Logo from "components/Logo/Logo";
import NavigationLinks from "components/NavigationLinks/NavigationLinks";
import ToggleThemeButton from "components/ToggleThemeButton/ToggleThemeButton";

function App() {
  const [opened, { toggle, close }] = useDisclosure();

  const location = useLocation();
  useEffect(() => {
    close();
  }, [close, location]);

  return (
    <MantineProvider defaultColorScheme="light">
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
        <AppShell.Main style={{ backgroundColor: "#fbfbfb" }}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <Notifications position="top-center" />
    </MantineProvider>
  );
}

export default App;
