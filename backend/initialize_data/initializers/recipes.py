# Create your views here.
import json
import logging
import pathlib
from os import path

from menus.models.recipes import Recipe

logger = logging.getLogger("cociplan")


def load_ingredients_from_json() -> list[dict]:
    recipes_list: list[dict] = []

    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "ingredients.json",
    )

    with open(json_path, "r", encoding="utf-8") as file:
        data = file.read()
        data = json.loads(data)
        for recipe in data:
            recipes_list.append(recipe)

    return recipes_list


def load_sides_from_json() -> list[dict]:
    recipes_list: list[dict] = []

    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "sides.json",
    )

    with open(json_path, "r", encoding="utf-8") as file:
        data = file.read()
        data = json.loads(data)
        for recipe in data:
            recipes_list.append(recipe)

    return recipes_list


def create_initial_recipes() -> list[Recipe]:
    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "recipes.json",
    )
    recipes_json_list = load_initial_recipes_from_json(json_path)
    create_recipes_list = create_initial_recipes_from_list(recipes_json_list)
    return create_recipes_list


def load_initial_recipes_from_json(json_path: str) -> list[dict]:
    recipes_list: list[dict] = []

    with open(json_path, "r", encoding="utf-8") as file:
        data = file.read()
        data = json.loads(data)
        for recipe in data:
            recipes_list.append(recipe)

    return recipes_list


def create_initial_recipes_from_list(recipes_list: list[dict]) -> list[Recipe]:
    created_recipes_list: list[Recipe] = []

    for recipe in recipes_list:
        # get the product by name
        existing = Recipe.objects.filter(name=recipe["name"]).exists()
        if existing:
            logger.debug(f"Recipe {recipe['name']} already exists")
            continue
        result = Recipe.objects.create(
            name=recipe["name"],
            description=recipe["description"],
            difficulty=recipe["difficulty"],
            instructions=recipe["instructions"],
            preference=recipe["preference"],
            prefered_meal=recipe["prefered_meal"],
            preparation_time=recipe["preparation_time"],
            servings=recipe["servings"],
            meal=recipe["meal"],
            meal_temp=recipe["meal_temp"],
            notes=recipe["notes"],
        )
        if result:
            created_recipes_list.append(result)

        logger.info(f"Created recipe {recipe['name']}. Importing ingredients...")
        ingredients = load_ingredients_from_json()

        for ingredient in ingredients:
            if ingredient["recipe_id"] == recipe["id"]:
                logger.debug(f"Creating ingredient {ingredient['product_id']} for recipe {recipe['name']}")
                result.ingredients.create(
                    product_id=ingredient["product_id"],
                    quantity=ingredient["quantity"],
                )
        logger.info(f"Created ingredients for recipe {recipe['name']}. Importing sides...")
        sides = load_sides_from_json()

        for side in sides:
            if side["recipe_id"] == recipe["id"]:
                logger.debug(f"Creating side {side['product_id']} for recipe {recipe['name']}")
                result.sides.create(
                    product_id=side["product_id"],
                    quantity=side["quantity"],
                )

    return created_recipes_list
