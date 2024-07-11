import { JSONContent } from "@tiptap/core";
import { IIngredient } from "./ingredients";
import { IRecipeTypes } from "./recipes-types";

export type MealTypes = "LUNCH" | "DINNER";
export type MealTemps = "WARM" | "COLD";
export type DaysOfWeek = "WEEK_DAYS" | "WEEKENDS" | "ALL";

export interface IRecipeImageFormFields {
  recipe: number;
  image: string;
}

export interface IRecipeFormFields {
  active: boolean;
  difficulty: number;
  image: IRecipeImageFormFields;
  instructions: JSONContent;
  meal: MealTypes;
  mealTemp: MealTemps;
  name: string;
  notes: JSONContent;
  preference: number;
  preferedMeal: MealTypes;
  preparationTime: number;
  servings: number;
  isOnlyDinner: boolean;
  isOnlyLunch: boolean;
  isOvenRecipe: boolean;
  isSidePlate: boolean;
  canBeDinner: boolean;
  canBeLunch: boolean;
  daysOfWeek: DaysOfWeek;
  seasonSpring: boolean;
  seasonSummer: boolean;
  seasonAutumn: boolean;
  seasonWinter: boolean;
  type: IRecipeTypes;
}

export interface IRecipe extends IRecipeFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
  ingredients: IIngredient[];
  sides: IRecipe[];
}

export interface RecipeFormValues {
  active: boolean;
  name: string;
  meal: MealTypes;
  mealTemp: MealTemps;
  ingredients: { product: any; quantity: string; key: any }[];
  instructions: string | JSONContent;
  notes: string | JSONContent;
  preferedMeal: MealTypes;
  preparationTime: number;
  servings: number;
  sides: { id: any; key: any }[];
  preference: number;
  difficulty: number;
  isSidePlate: boolean;
  isOnlyLunch: boolean;
  isOnlyDinner: boolean;
  isOvenRecipe: boolean;
  daysOfWeek: DaysOfWeek;
  seasonSpring: boolean;
  seasonSummer: boolean;
  seasonAutumn: boolean;
  seasonWinter: boolean;
  image: any;
  type: string;
}
