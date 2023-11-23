import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  ActionIcon,
  AppShell,
  Button,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Navbar,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import Brand from "components/Brand/Brand";
import NavigationLinks from "components/NavigationLinks/NavigationLinks";
import i18n from "i18n";

function useDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches
  );
}

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    useDarkMode() ? "dark" : "light",
  );
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [opened, setOpened] = useState(false);

  const changeLanguage = (lng: string) => {
    console.log("Change language to", lng);
    i18n.changeLanguage(lng);
  };

  const location = useLocation();
  useEffect(() => {
    setOpened(false);
  }, [location]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withNormalizeCSS
        withGlobalStyles
      >
        <AppShell
          navbarOffsetBreakpoint="sm"
          padding="md"
          navbar={
            <Navbar
              hiddenBreakpoint="sm"
              hidden={!opened}
              width={{ sm: 250, lg: 300 }}
              height="calc(100vh - 105px)"
              p="md"
            >
              <Navbar.Section grow mt="md">
                <NavigationLinks />
              </Navbar.Section>
              <Navbar.Section>
                <Group>
                  <ActionIcon
                    variant="default"
                    onClick={() => toggleColorScheme()}
                    size={30}
                  >
                    {colorScheme === "dark" ? (
                      <IconSun size={16} />
                    ) : (
                      <IconMoonStars size={16} />
                    )}
                  </ActionIcon>

                  <Button
                    variant="subtle"
                    compact
                    uppercase
                    onClick={() => changeLanguage("es")}
                  >
                    es
                  </Button>
                  <Button
                    variant="subtle"
                    compact
                    uppercase
                    onClick={() => changeLanguage("en")}
                  >
                    en
                  </Button>
                </Group>
              </Navbar.Section>
            </Navbar>
          }
          header={
            <Header height={60} p="xs">
              <Brand opened={opened} setOpened={setOpened} />
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Outlet />
        </AppShell>
        <Notifications />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
