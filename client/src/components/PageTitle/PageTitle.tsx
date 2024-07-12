import React from "react";
import { useNavigate } from "react-router-dom";
import { Group, Title, Text, Badge, ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

interface PageTitleProps {
  header: string;
  withBackButton?: boolean;
  backRoute?: string;
  subHeader?: string | null;
  icon?: React.ReactNode | null;
}

function PageTitle({
  withBackButton = false,
  backRoute = "",
  header,
  subHeader = null,
  icon = null,
}: Readonly<PageTitleProps>) {
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(backRoute);
  };

  return (
    <Group grow>
      <Title order={1} mt="md" textWrap="pretty">
        {withBackButton && (
          <ActionIcon
            style={{ display: "inline" }}
            variant="subtle"
            onClick={navigateBack}
          >
            <IconArrowLeft />
          </ActionIcon>
        )}{" "}
        {icon} {header}
      </Title>
      <Text size="sm">{subHeader && <Badge>{subHeader}</Badge>}</Text>
    </Group>
  );
}

export default PageTitle;
