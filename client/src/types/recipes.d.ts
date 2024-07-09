import { JSONContent } from "@tiptap/core";
import { IIngredient } from "./ingredients";

export type MealTypes = "LUNCH" | "DINNER";
export type MealTemps = "WARM" | "COLD";
export type DaysOfWeek = "WEEK_DAYS" | "WEEKENDS" | "ALL";

export interface IRecipeFormFields {
  active: boolean;
  description: JSONContent;
  difficulty: number;
  image: string;
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
  type:
    | "MEAT_SASUAGE"
    | "FISH"
    | "VEGETABLES"
    | "LEGUMES"
    | "EGGS"
    | "FRUITS"
    | "MILK_RECIPE"
    | "GRAIN_NUTS"
    | "BAKING"
    | "POULTRY"
    | "PASTA"
    | "RICE"
    | "POTATOES"
    | "SOUPS"
    | "OTHER"
    | "DESSERTS"
    | "NONE";
}

export interface IRecipe extends IRecipeFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
  ingredients: IIngredient[];
  sides: IRecipe[];
}
