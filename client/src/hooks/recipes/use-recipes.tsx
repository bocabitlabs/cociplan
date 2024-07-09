import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import { IRecipe, IRecipeFormFields } from "types/recipes";

export const fetchRecipes = async () => {
  const { data } = await apiClient.get<any>(`/recipes/`);
  return data;
};

export function useRecipes(options = {}) {
  return useQuery<any, Error>(["recipes"], () => fetchRecipes(), {
    ...options,
  });
}

export const fetchSides = async () => {
  const { data } = await apiClient.get<any>(`/recipes/?isSidePlate=true`);
  return data;
};

export function useSides(options = {}) {
  return useQuery<any, Error>(["recipes", "sides"], () => fetchSides(), {
    ...options,
  });
}

export const useAddrecipe = () => {
  const { t } = useTranslation();
  return useMutation(
    (newRecipe: IRecipeFormFields) => apiClient.post(`/recipes/`, newRecipe),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Creado"),
          message: t("La receta ha sido creada"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: t("No creada"),
          message: t("No se ha podido crear la receta"),
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
      },
    },
  );
};

export const useDeleteRecipe = () => {
  const { t } = useTranslation();

  return useMutation((id: number) => apiClient.delete(`/recipes/${id}/`), {
    onSuccess: () => {
      notifications.show({
        title: t("Borrada"),
        message: t("La receta ha sido borrada"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["recipes"]);
    },
    onError: () => {
      notifications.show({
        title: t("No Borrada"),
        message: t("La receta no ha sido borrada"),
        color: "red",
        autoClose: 2000,
        icon: <IconX size="1rem" />,
      });
    },
  });
};

export const fetchRecipe = async (recipeId: number | undefined) => {
  const { data } = await apiClient.get<IRecipe>(`/recipes/${recipeId}/`);
  return data;
};

export function useRecipe(recipeId: number | undefined, options = {}) {
  return useQuery<IRecipe, Error>(
    ["recipes", recipeId],
    () => fetchRecipe(recipeId),
    {
      ...options,
    },
  );
}

interface IRecipeUpdateFields {
  recipeId: number | undefined;
  newRecipe: IRecipeFormFields;
}

export const useUpdateRecipe = () => {
  return useMutation(
    ({ recipeId, newRecipe }: IRecipeUpdateFields) =>
      apiClient.patch(`/recipes/${recipeId}/`, newRecipe),
    {
      onSuccess: () => {
        notifications.show({
          title: "Actualizada",
          message: "La receta ha sido actualizada",
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: "No actualizada",
          message: "No se ha podido actualizar la receta",
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
      },
    },
  );
};

export const useInitializeRecipes = () => {
  const { t } = useTranslation();

  return useMutation(
    () => apiClient.post<IRecipe[]>(`/initialize-data/recipes/`),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Creadas"),
          message: "Productos creadas correctamente",
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: t("No creadas"),
          message: "No se han podido crear las recetas",
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
    },
  );
};
