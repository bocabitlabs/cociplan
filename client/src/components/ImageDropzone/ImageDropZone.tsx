/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from "react-i18next";
import { rem, useMantineTheme, Text, Group } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

export default function ImageDropZone(props: Partial<DropzoneProps>) {
  const theme = useMantineTheme();
  const { onDrop, onReject } = props;
  const { t } = useTranslation();
  const handleDrop = (files: File[]) => {
    if (onDrop) onDrop(files);
  };
  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={onReject}
      maxSize={3 * 1024 ** 2}
      maxFiles={1}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {t("Arrastra hasta aquí o haz click para subir una imagen")}
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            {t(
              "Attach as many files as you like, each file should not exceed 5mb",
            )}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
