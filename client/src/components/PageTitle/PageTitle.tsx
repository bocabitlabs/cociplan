import React from "react";
import { useNavigate } from "react-router-dom";
import { Group, Title, Text, Badge, ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

interface PageTitleProps {
  header: string;
  subHeader?: string | null;
  icon?: React.ReactNode | null;
  withBackButton?: boolean;
}

function PageTitle({
  withBackButton = false,
  header,
  subHeader = null,
  icon = null,
}: Readonly<PageTitleProps>) {
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <Group grow>
      <Title order={1} mt="md" textWrap="wrap">
        {withBackButton && (
          <ActionIcon style={{ display: "inline" }} onClick={navigateBack}>
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
