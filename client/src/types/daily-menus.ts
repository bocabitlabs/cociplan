import { IRecipe } from "./recipes";

export interface IDailyMenu {
  id: number;
  lunchRecipe: IRecipe;
  dinnerRecipe: IRecipe;
}
