export interface IProductFormFields {
  name: string;
  type:
    | "NONE"
    | "EGG_MILK_PRODUCTS"
    | "FATS_OILS"
    | "FRUITS"
    | "GRAIN_NUTS_BAKING"
    | "HERBS_SPICES"
    | "MEAT_SASUAGE"
    | "FISH"
    | "PASTA_RICE"
    | "VEGETABLES"
    | "LEGUMES"
    | "OTHER";
}

export interface IProduct extends IProductFormFields {
  id: string;
}
