import { IProduct } from "./products";

export interface IIngredientFormFields {
  name: string;
  quantity: string;
}

export interface IIngredient extends IIngredientFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
  product: IProduct;
  recipe: IProduct;
}
