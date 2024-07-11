import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { apiClient } from "api/api-client";
import queryClient from "api/query-client";
import {
  IRecipe,
  IRecipeFormFields,
  IRecipeImageFormFields,
} from "types/recipes";

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

export const useAddRecipeImage = () => {
  return useMutation((newRecipe: IRecipeImageFormFields) =>
    apiClient.post(`/recipes-images/`, newRecipe, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const useAddrecipe = () => {
  const { t } = useTranslation();
  return useMutation(
    (newRecipe: IRecipeFormFields) => apiClient.post(`/recipes/`, newRecipe),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Created"),
          message: t("Recipe has been created successfully"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: t("Not created"),
          message: t("Unable to create the recipe"),
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
        title: t("Deleted"),
        message: t("The recipe has been deleted successfully"),
        color: "teal",
        autoClose: 2000,
        icon: <IconCheck size="1rem" />,
      });
      queryClient.invalidateQueries(["recipes"]);
    },
    onError: () => {
      notifications.show({
        title: t("Not deleted"),
        message: t("The recipe could not be deleted"),
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
  const { t } = useTranslation();

  return useMutation(
    ({ recipeId, newRecipe }: IRecipeUpdateFields) =>
      apiClient.patch(`/recipes/${recipeId}/`, newRecipe),
    {
      onSuccess: () => {
        notifications.show({
          title: t("Updated"),
          message: t("The recipe has been updated successfully"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: t("Not updated"),
          message: t("The recipe could not be updated"),
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
          title: t("Created"),
          message: t("Sample recipes created successfully"),
          color: "teal",
          autoClose: 2000,
          icon: <IconCheck size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
      onError: () => {
        notifications.show({
          title: t("Not created"),
          message: t("Unable to create sample recipes"),
          color: "red",
          autoClose: 2000,
          icon: <IconX size="1rem" />,
        });
        queryClient.invalidateQueries(["recipes"]);
      },
    },
  );
};
