import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IProduct, IProductFormFields } from "types/products";

export const fetchProducts = async () => {
  const { data } = await apiClient.get<any>(`/products/`);
  return data;
};

export function useProducts(options = {}) {
  return useQuery<any, Error>(["products"], () => fetchProducts(), {
    ...options,
  });
}

export const useAddProduct = () => {
  const { t } = useTranslation();
  return useMutation(
    (newProduct: IProductFormFields) =>
      apiClient.post(`/products/`, newProduct),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Creado"),
          message: t("El producto ha sido creado"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["products"]);
      },
      onError: () => {
        notifications.show({
          title: t("No creado"),
          message: t("No se ha podido crear el producto"),
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
      },
    },
  );
};

export const useDeleteProduct = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/products/${id}/`), {
    onSuccess: () => {
      notifications.show({
        title: t("Borrado"),
        message: t("El producto ha sido borrado"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      notifications.show({
        title: t("No Borrado"),
        message: t("El producto no ha sido borrado"),
        color: "red",
        autoClose: 2000,
        icon: <IconX size="1rem" />,
      });
    },
  });
};

export const useInitializeProducts = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<IProduct[]>(`/initialize-data/products/`),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Creados"),
          message: "Productos creados correctamente",
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["products"]);
      },
      onError: () => {
        notifications.show({
          title: t("No creados"),
          message: "No se han podido crear los productos",
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
        queryClient.invalidateQueries(["products"]);
      },
    },
  );
};
