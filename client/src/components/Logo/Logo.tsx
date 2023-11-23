import { Group, ColorScheme, Text, Image } from "@mantine/core";

export default function Logo({ colorScheme }: { colorScheme: ColorScheme }) {
  return (
    <Group>
      <Image src="/icons/favicon-192.png" width={40} height={40} />
      <Text color={colorScheme === "dark" ? "#fff" : "#000"}>
        <strong>Cociplan</strong>{" "}
      </Text>
    </Group>
  );
}
