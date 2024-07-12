import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IProduct, IProductFormFields } from "types/products";

export const fetchProducts = async (page: number = 1, search?: string) => {
  let query = `?page=${page}`;
  if (search && search?.length > 0) {
    query = `?page=${page}&search=${search}`;
  }
  const { data } = await apiClient.get<any>(`/products/${query}`);
  return data;
};

export function useProducts(page: number, search?: string, options = {}) {
  return useQuery<any, Error>(
    ["products", page, search],
    () => fetchProducts(page, search),
    {
      ...options,
    },
  );
}

export const fetchProductsNoLimit = async () => {
  const { data } = await apiClient.get<any>(`/products-no-limit/`);
  return data;
};

export function useProductsNoLimit(options = {}) {
  return useQuery<any, Error>(
    ["products-no-limit"],
    () => fetchProductsNoLimit(),
    {
      ...options,
    },
  );
}

export const useAddProduct = () => {
  const { t } = useTranslation();
  return useMutation(
    (newProduct: IProductFormFields) =>
      apiClient.post(`/products/`, newProduct),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Created"),
          message: t("The product has been created successfully"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["products"]);
      },
      onError: () => {
        notifications.show({
          title: t("Not created"),
          message: t("Unable to create the product"),
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
