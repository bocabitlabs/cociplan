import { IRecipe } from "./recipes";

export type MealTypes = "LUNCH" | "DINNER";
export type MealTemps = "HOT" | "COLD";

export interface IDailyMenu {
  id: number;
  lunchRecipe: IRecipe;
  dinnerRecipe: IRecipe;
}
export interface IWeeklyMenu {
  id: number;
  dateCreated: string;
  name: string;
  mondayMenu: IDailyMenu;
  tuesdayMenu: IDailyMenu;
  wednesdayMenu: IDailyMenu;
  thursdayMenu: IDailyMenu;
  fridayMenu: IDailyMenu;
  saturdayMenu: IDailyMenu;
  sundayMenu: IDailyMenu;
}
export interface IWeeklyMenuResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: IWeeklyMenu[];
}
