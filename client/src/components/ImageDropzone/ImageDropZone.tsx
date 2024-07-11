/* eslint-disable react/jsx-props-no-spreading */
import { useTranslation } from "react-i18next";
import {
  rem,
  useMantineTheme,
  Text,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

export default function ImageDropZone(props: Partial<DropzoneProps>) {
  const theme = useMantineTheme();
  const scheme = useMantineColorScheme();
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
        style={{
          justifyContent: "center",
          minHeight: rem(220),
          pointerEvents: "none",
        }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                scheme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[scheme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {t("Drag and drop image here or click to select file")}
          </Text>
          <Text size="sm" inline mt={7}>
            {t("Attach one file that should not exceed 5mb")}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
