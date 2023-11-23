import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IWeeklyMenu } from "types/weekly-menus";

export const fetchWeeklyMenus = async () => {
  const { data } = await apiClient.get<IWeeklyMenu[]>(`/weekly-menus/`);
  return data;
};

export function useWeeklyMenus(options = {}) {
  return useQuery<IWeeklyMenu[], Error>(
    ["weekly-menus"],
    () => fetchWeeklyMenus(),
    {
      ...options,
    },
  );
}

export const fetchWeeklyMenu = async (menuId: string | undefined) => {
  const { data } = await apiClient.get<IWeeklyMenu>(`/weekly-menus/${menuId}`);
  return data;
};

export function useWeeklyMenu(menuId: string | undefined, options = {}) {
  return useQuery<IWeeklyMenu, Error>(
    ["weekly-menus", menuId],
    () => fetchWeeklyMenu(menuId),
    {
      enabled: !!menuId,
      ...options,
    },
  );
}

export const useAddWeeklyMenu = () => {
  const { t } = useTranslation();
  return useMutation(() => apiClient.post(`/weekly-menus/`, {}), {
    onSuccess: () => {
      notifications.show({
        title: t("Creado"),
        message: t("Se ha creado el menu semanal"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["weekly-menus"]);
    },
    onError: () => {
      notifications.show({
        title: t("No creada"),
        message: t("No se ha podido crear el menu semanal"),
        color: "red",
        autoClose: 2000,
        icon: <IconX size="1rem" />,
      });
    },
  });
};

export const useDeleteWeeklyMenu = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/weekly-menus/${id}/`), {
    onSuccess: () => {
      notifications.show({
        title: t("Borrado"),
        message: t("El menu semanal ha sido borrada"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["weekly-menus"]);
    },
    onError: () => {
      notifications.show({
        title: t("No Borrado"),
        message: t("El menu semanal no ha sido borrado"),
        color: "red",
        autoClose: 2000,
        icon: <IconX size="1rem" />,
      });
    },
  });
};

interface IUpdateWeeklyMenu {
  id: string;
  name: string | undefined;
}

export const useUpdateWeeklyMenu = () => {
  const { t } = useTranslation();

  return useMutation(
    (data: IUpdateWeeklyMenu) =>
      apiClient.patch(`/weekly-menus/${data.id}/`, data),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Actualizado"),
          message: t("El menu semanal ha sido actualizado"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["weekly-menus"]);
      },
      onError: () => {
        notifications.show({
          title: t("No Actualizado"),
          message: t("El menu semanal no ha sido actualizado"),
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
      },
    },
  );
};
