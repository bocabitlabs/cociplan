export const recipeTypes = [
  { value: "MEAT_SASUAGE", label: "Carne/Embutidos" },
  { value: "FISH", label: "Pescado" },
  { value: "VEGETABLES", label: "Verduras" },
  { value: "LEGUMES", label: "Legumbres" },
  { value: "EGGS", label: "Huevos" },
  { value: "FRUITS", label: "Frutas" },
  { value: "MILK_RECIPE", label: "Recetas con leche" },
  { value: "GRAIN_NUTS", label: "Frutos secos" },
  { value: "BAKING", label: "Horneado" },
  { value: "POULTRY", label: "Aves" },
  { value: "PASTA", label: "Pasta" },
  { value: "RICE", label: "Arroz" },
  { value: "POTATOES", label: "Patatas" },
  { value: "SOUPS", label: "Sopas" },
  { value: "OTHER", label: "Otro" },
  { value: "DESSERTS", label: "Postres" },
  { value: "NONE", label: "Ninguno" },
];

export function getRecipeTypeLabel(value: string): string | undefined {
  const recipeLabel = recipeTypes.find(
    (recipe) => recipe.value === value,
  )?.label;
  return recipeLabel;
}

export default recipeTypes;
