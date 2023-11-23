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
  canBeDinner: boolean;
  canBeLunch: boolean;
  daysOfWeek: DaysOfWeek;
  seasonSpring: boolean;
  seasonSummer: boolean;
  seasonAutumn: boolean;
  seasonWinter: boolean;
}

export interface IRecipe extends IRecipeFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
  ingredients: IIngredient[];
  sides: IIngredient[];
}
