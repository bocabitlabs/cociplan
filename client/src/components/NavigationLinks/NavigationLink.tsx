import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  Group,
  ThemeIcon,
  Text,
  useMantineTheme,
  MantineTheme,
} from "@mantine/core";
import styled from "styled-components";

interface NavigationLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

const StyledNavLink = styled(NavLink)<{ theme: MantineTheme }>`
  &:hover {
    background-color: ${({ theme }) =>
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0]};
  }
  &.active {
    background-color: ${({ theme }) =>
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0]};
  }
`;

export default function NavigationLink({
  icon,
  color,
  label,
  to,
}: NavigationLinkProps) {
  const theme = useMantineTheme();
  const linkStyle = {
    display: "block",
    width: "95%",
    textDecoration: "none",
    padding: `${theme.spacing.xs}`,
    borderRadius: `${theme.radius.sm}`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  };
  const { t } = useTranslation();

  return (
    <StyledNavLink theme={theme} to={to} className="navLink" style={linkStyle}>
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{t(label)}</Text>
      </Group>
    </StyledNavLink>
  );
}
