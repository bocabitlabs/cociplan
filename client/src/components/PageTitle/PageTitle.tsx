import React from "react";
import { useNavigate } from "react-router-dom";
import { Group, Title, Text, Badge, ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

interface PageTitleProps {
  withBackButton?: boolean;
  header: string;
  subHeader?: string;
  icon?: React.ReactNode;
}

function PageTitle({
  withBackButton,
  header,
  subHeader,
  icon,
}: PageTitleProps) {
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <Group grow>
      <Title
        order={1}
        sx={(theme) => ({
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[2]
              : theme.colors.gray[9],
        })}
        mt="md"
      >
        {withBackButton && (
          <ActionIcon style={{ display: "inline" }} onClick={navigateBack}>
            <IconArrowLeft />
          </ActionIcon>
        )}{" "}
        {icon} {header}
      </Title>
      <Text
        size="sm"
        sx={(theme) => ({
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[3]
              : theme.colors.gray[7],
        })}
      >
        {subHeader && <Badge>{subHeader}</Badge>}
      </Text>
    </Group>
  );
}

PageTitle.defaultProps = {
  withBackButton: false,
  subHeader: null,
  icon: null,
};

export default PageTitle;
