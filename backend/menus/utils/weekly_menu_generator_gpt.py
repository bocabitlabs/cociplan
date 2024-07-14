import json
import logging

from django.conf import settings
from openai import OpenAI

from menus.models.daily_menus import DailyMenu
from menus.models.recipes import Recipe, RecipeType
from menus.utils.weekly_menu_generator import (
    generate_lunch_recipes_list,
    generate_menu_name,
    get_last_menu_and_id,
    get_next_monday_month,
    get_next_monday_week_number,
    get_recipes_from_menu,
)

logger = logging.getLogger("cociplan")

input_prompt = """You are a nutritionist and you want to create an
     equilibrated weekly menu.
    The weekly menu is composed of 14 recipes, 2 per day.
    The weekly menu will meet several conditions:
     - It will contain 7 daily menus, one for each day of the week.
     - It will get recipes for lunch and dinner.
     For each recipe:
     - If meal is LUNCH, it will be served only at lunchtime.
     - If meal is DINNER, it will be served only at dinnertime.
     - If meal is BOTH, it can be served both at lunchtime or dinnertime.
     - If days_of_week is WEEK_DAYS, it will be served from Monday to Friday.
     - If days_of_week is WEEKENDS, it will be served on Saturday and Sunday.
     - If days_of_week is ALL, it will be served every day.
     - The recipes will have a difficulty from 1 to 5.
     - The recipe will have a type: {recipe_types}.

     The input will be a json object with the following structure:
     [{recipe: "recipe_id",
     meal: "LUNCH"| "DINNER"|"BOTH",
     difficulty: 1-5,
     days_of_week: "WEEK_DAYS"|"WEEKENDS"|"ALL",
     type: {recipe_types},
     name: "recipe_name"},
     ...]

     Output:
     - Very important: The output will be a json object with the same
     structure as the input,
     but with 2 recipes per day.
     The format of the output will be:
        {"monday":
            "lunch":
            {"recipe": "recipe_id",
            "meal": "LUNCH",
            "difficulty": 1-5,
            "type": "recipe_type",
            "name": "recipe_name"
            },
            "dinner": {
                "recipe": "recipe_id",
                "meal": "DINNER",
                "difficulty": 1-5,
                "type": "recipe_type"
                "name": "recipe_name"
            },
        }, ...}
     - Be concise. Do not explain how you do it. Just generate the menu
     with the specified format.
     - Use only recipes in the lists of recipes provided.
     - The first days of the week, the recipes will be the ones with more dificulty.
     - The weekly menu must be equilibrated and must contain at
     least one of each type: MEAT_SASUAGE, VEGETABLES, FISH, and LEGUMES.
"""


def generate_menu_gpt(last_menu, new_menu_name):
    excluded_lunch_recipes, excluded_dinner_recipes = get_recipes_from_menu(last_menu)

    lunch_recipes = generate_lunch_recipes_list(excluded_lunch_recipes)
    dinner_recipes = generate_lunch_recipes_list(excluded_dinner_recipes)

    recipe_types = [recipe_type[1] for recipe_type in RecipeType.choices]
    recipe_types_string = "|".join(recipe_types)

    input_prompt_expanded = input_prompt.replace("{recipe_types}", recipe_types_string)

    lunch_recipes_json = []
    for recipe in lunch_recipes:
        lunch_recipes_json.append(
            {
                "recipe": str(recipe.id),
                "meal": recipe.meal,
                "difficulty": str(recipe.difficulty),
                "type": recipe.type,
                "days_of_week": recipe.days_of_week,
                "name": recipe.name,
            }
        )

    dinner_recipes_json = []
    for recipe in dinner_recipes:
        dinner_recipes_json.append(
            {
                "recipe": str(recipe.id),
                "meal": recipe.meal,
                "difficulty": str(recipe.difficulty),
                "type": recipe.type,
                "days_of_week": recipe.days_of_week,
                "name": recipe.name,
            }
        )
    # Convert to string the json objects
    lunch_recipes_json = str(lunch_recipes_json)
    dinner_recipes_json = str(dinner_recipes_json)
    client = OpenAI(
        api_key=settings.OPENAI_API_KEY,
    )
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": input_prompt_expanded},
            {
                "role": "system",
                "content": f"Available Lunch recipes: {lunch_recipes_json}",
            },
            {
                "role": "system",
                "content": f"Availbale Dinner recipes: {dinner_recipes_json}",
            },
            {
                "role": "user",
                "content": "Generate a weekly menu with the provided recipes.",
            },
        ],
    )

    generated_recipes = response.choices[0].message.content
    logger.debug(generated_recipes)
    generated_recipes = json.loads(generated_recipes)
    # Assign the first recipe of the lunch_recipes queryset to the monday_menu object
    monday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Lunes",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["monday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["monday"]["dinner"]["recipe"])
        ),
    )
    tuesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Martes",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["tuesday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["tuesday"]["dinner"]["recipe"])
        ),
    )
    wednesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Miércoles",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["wednesday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["wednesday"]["dinner"]["recipe"])
        ),
    )
    thursday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Jueves",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["thursday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["thursday"]["dinner"]["recipe"])
        ),
    )
    friday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Viernes",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["friday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["friday"]["dinner"]["recipe"])
        ),
    )
    saturday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Sábado",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["saturday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["saturday"]["dinner"]["recipe"])
        ),
    )
    sunday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Domingo",
        lunch_recipe=Recipe.objects.get(
            id=int(generated_recipes["sunday"]["lunch"]["recipe"])
        ),
        dinner_recipe=Recipe.objects.get(
            id=int(generated_recipes["sunday"]["dinner"]["recipe"])
        ),
    )

    return (
        monday_menu,
        tuesday_menu,
        wednesday_menu,
        thursday_menu,
        friday_menu,
        saturday_menu,
        sunday_menu,
    )


def create_new_weekly_menu_gpt(serializer):
    next_monday_month = get_next_monday_month()
    next_monday_week_number = get_next_monday_week_number()

    last_menu, last_menu_id = get_last_menu_and_id()

    new_menu_name = generate_menu_name(
        next_monday_week_number, next_monday_month, last_menu_id
    )
    menus = generate_menu_gpt(last_menu, new_menu_name)

    serializer.save(
        name=new_menu_name,
        monday_menu=menus[0],
        tuesday_menu=menus[1],
        wednesday_menu=menus[2],
        thursday_menu=menus[3],
        friday_menu=menus[4],
        saturday_menu=menus[5],
        sunday_menu=menus[6],
    )
