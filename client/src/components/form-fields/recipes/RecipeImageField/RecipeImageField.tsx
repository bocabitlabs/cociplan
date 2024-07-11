import { useEffect, useState } from "react";
import { Group, SimpleGrid, Image } from "@mantine/core";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import ImageDropZone from "components/ImageDropzone/ImageDropZone";

type Props = { form: any };

export default function RecipeImageField({ form }: Props) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  useEffect(() => {
    if (files.length > 0) {
      form.setFieldValue("image", files[0]);
    }
  }, [files, form]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        width={200}
        mt="md"
        height="auto"
      />
    );
  });
  return (
    <Group mt="md">
      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
        <ImageDropZone accept={IMAGE_MIME_TYPE} mt="md" onDrop={setFiles} />

        {previews}
      </SimpleGrid>
    </Group>
  );
}
