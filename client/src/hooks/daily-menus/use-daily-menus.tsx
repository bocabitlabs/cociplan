import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IDailyMenu } from "types/daily-menus";

export const fetchDailyMenu = async (menuId: number | undefined) => {
  const { data } = await apiClient.get<IDailyMenu>(`/daily-menus/${menuId}`);
  return data;
};

export function useDailyMenu(menuId: number | undefined, options = {}) {
  return useQuery<IDailyMenu, Error>(
    ["daily-menus", menuId],
    () => fetchDailyMenu(menuId),
    {
      enabled: !!menuId,
      ...options,
    },
  );
}

interface IUpdateDailyMenu {
  dailyMenuId: number;
  lunchRecipe: number | undefined;
  dinnerRecipe: number | undefined;
  weeklyMenuId: number | undefined;
}

export const useUpdateDailyMenu = () => {
  const { t } = useTranslation();
  return useMutation(
    (recipes: IUpdateDailyMenu) =>
      apiClient.patch(`/daily-menus/${recipes.dailyMenuId}/`, recipes),
    {
      onSuccess: (data, variables) => {
        notifications.show({
          title: t("Updated"),
          message: t("Daily menu has been updated successfully"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        console.log(variables);
        queryClient.invalidateQueries(["weekly-menus", variables.weeklyMenuId]);
      },
      onError: () => {
        notifications.show({
          title: t("Not updated"),
          message: t("Unable to update daily menu"),
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
      },
    },
  );
};

export default useUpdateDailyMenu;
