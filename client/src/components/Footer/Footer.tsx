import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Anchor, List, Modal, Text, Title } from "@mantine/core";
import { PACKAGE_VERSION } from "version";

export function Footer() {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();
  return (
    <Text size="sm" style={{ justifyContent: "center", marginTop: 20 }}>
      {t("Version")} {PACKAGE_VERSION} - Bocabitlabs - 2022 -{" "}
      {new Date().getFullYear()} -{" "}
      <Anchor onClick={() => setOpened(true)}>{t("Credits")}</Anchor>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={3}>{t("Credits")}</Title>}
      >
        <Title order={4} style={{ marginBottom: 10 }}>
          {t("Images and resources")}
        </Title>
        <List>
          <List.Item>
            <Anchor
              href="https://www.flaticon.com/free-icons/transcription"
              title="transcription icons"
              target="_blank"
              rel="noopener noreferrer"
            >
              - Flaticon
            </Anchor>
          </List.Item>
        </List>
      </Modal>
    </Text>
  );
}

export default Footer;
