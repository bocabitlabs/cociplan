import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";
import { useInitializeProducts } from "hooks/products/use-products";

export default function AddProductButton() {
  const { mutate } = useInitializeProducts();
  const { t } = useTranslation();
  const onClick = () => {
    mutate();
  };

  return (
    <Button variant="outline" onClick={onClick}>
      {t("Initialize products")}
    </Button>
  );
}
