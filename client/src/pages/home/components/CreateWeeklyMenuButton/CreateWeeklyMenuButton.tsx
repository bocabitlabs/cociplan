import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useAddWeeklyMenu } from "hooks/weekly-menus/use-weekly-menus";

export default function CreateWeeklyMenuButton() {
  const { mutate, isLoading } = useAddWeeklyMenu();
  const { t } = useTranslation();

  const handleClick = () => {
    mutate();
  };

  return (
    <Button
      leftIcon={<IconPlus size="1rem" />}
      loading={isLoading}
      onClick={handleClick}
    >
      {t("Create weekly menu")}
    </Button>
  );
}
