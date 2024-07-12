import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { List, Stack, Title } from "@mantine/core";
import { generateHTML } from "@tiptap/core";
import { IIngredient } from "types/ingredients";
import { IRecipe } from "types/recipes";
import { editorExtensions } from "utils/editor";

type Props = { recipe: IRecipe };

export default function RecipeInstructions({ recipe }: Props) {
  const { t } = useTranslation();

  const instructions = useMemo(() => {
    if (recipe && recipe.instructions) {
      let instr = recipe.instructions;
      // Get the type of descr
      if (typeof instr === "string") {
        instr = JSON.parse(instr);
      }
      return generateHTML(instr, editorExtensions);
    }
    return "";
  }, [recipe]);

  return (
    <Stack>
      <Title order={2}>{t("Ingredients")}</Title>
      <List>
        {recipe.ingredients.map((ingredient: IIngredient) => (
          <List.Item key={ingredient.id}>
            {ingredient.product.name}: {ingredient.quantity}
          </List.Item>
        ))}
      </List>
      <Title order={2}>{t("Instructions")}</Title>
      <div dangerouslySetInnerHTML={{ __html: instructions }} />
      {recipe.sides && recipe.sides.length > 0 && (
        <>
          <Title order={2}>{t("Sides")}</Title>
          <List>
            {recipe.sides.map((side: IRecipe) => (
              <List.Item key={side.id}>
                <Link to={`/sides/${side.id}`}>{side.name}</Link>
              </List.Item>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}
