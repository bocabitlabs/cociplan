import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IWeeklyMenu, IWeeklyMenuResult } from "types/weekly-menus";

export const fetchWeeklyMenus = async (page: number = 1) => {
  const { data } = await apiClient.get<IWeeklyMenuResult>(
    `/weekly-menus/?page=${page}`,
  );
  return data;
};

export function useWeeklyMenus(page: number, options = {}) {
  return useQuery<IWeeklyMenuResult, Error>(
    ["weekly-menus", page],
    () => fetchWeeklyMenus(page),
    {
      ...options,
    },
  );
}

export const fetchWeeklyMenu = async (menuId: number | undefined) => {
  const { data } = await apiClient.get<IWeeklyMenu>(`/weekly-menus/${menuId}`);
  return data;
};

export function useWeeklyMenu(menuId: number | undefined, options = {}) {
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
        title: t("Created"),
        message: t("Weekly menu has been created successfully"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["weekly-menus"]);
    },
    onError: () => {
      notifications.show({
        title: t("Not created"),
        message: t("Unable to create the weekly menu"),
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
        title: t("Deleted"),
        message: t("Weekly menu has been deleted successfully"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["weekly-menus"]);
    },
    onError: () => {
      notifications.show({
        title: t("Not deleted"),
        message: t("Unable to delete the weekly menu"),
        color: "red",
        autoClose: 2000,
        icon: <IconX size="1rem" />,
      });
    },
  });
};

interface IUpdateWeeklyMenu {
  id: number;
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
