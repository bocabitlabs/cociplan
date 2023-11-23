import datetime
import logging
import random
from typing import Union

from menus.models.daily_menus import DailyMenu
from menus.models.recipes import Recipe
from menus.models.weekly_menus import WeeklyMenu

logger = logging.getLogger("cociplan")


def get_next_monday_month() -> str:
    # Get the next monday date
    next_monday = datetime.date.today() + datetime.timedelta(days=-datetime.date.today().weekday(), weeks=1)
    # Get the next monday month
    month = next_monday.strftime("%B")
    return month


def get_next_monday_week_number() -> int:
    # Get the next monday date
    next_monday = datetime.date.today() + datetime.timedelta(days=-datetime.date.today().weekday(), weeks=1)
    # Get the next monday week number of the month
    week_number_of_month = next_monday.isocalendar()[1] - next_monday.replace(day=1).isocalendar()[1] + 1
    return week_number_of_month


def generate_menu_name(week: int, month: str, previous_id: int) -> str:
    weekly_menu_name = f"Semana {week} - {month} (#{previous_id + 1})"
    return weekly_menu_name


def get_last_menu_and_id() -> tuple[Union[WeeklyMenu, None], int]:
    last_weekly_menu = WeeklyMenu.objects.last()
    last_weekly_menu_id = 1
    if last_weekly_menu:
        last_weekly_menu_id = last_weekly_menu.id
    return last_weekly_menu, last_weekly_menu_id


def get_recipes_from_menu(menu: WeeklyMenu) -> tuple[list[Recipe], list[Recipe]]:
    daily_menus = [
        menu.monday_menu,
        menu.tuesday_menu,
        menu.wednesday_menu,
        menu.thursday_menu,
        menu.friday_menu,
        menu.saturday_menu,
        menu.sunday_menu,
    ]
    # Get all the lunch and dinner recipes of the daily menus from the last weekly menu using a loop
    lunch_recipes: list[Recipe] = []
    dinner_recipes: list[Recipe] = []
    for daily_menu in daily_menus:
        lunch_recipes.append(daily_menu.lunch_recipe)
        dinner_recipes.append(daily_menu.dinner_recipe)

    return lunch_recipes, dinner_recipes


def get_current_season_of_the_year():
    # Get the current month and season of the year
    current_season = ""
    current_month = datetime.date.today().strftime("%B")
    if current_month in ["March", "April", "May"]:
        current_season = "spring"
    elif current_month in ["June", "July", "August"]:
        current_season = "summer"
    elif current_month in ["September", "October", "November"]:
        current_season = "autumn"
    elif current_month in ["December", "January", "February"]:
        current_season = "winter"
    return current_season


def create_new_weekly_menu(serializer):
    next_monday_month = get_next_monday_month()
    next_monday_week_number = get_next_monday_week_number()

    last_menu, last_menu_id = get_last_menu_and_id()

    new_menu_name = generate_menu_name(next_monday_week_number, next_monday_month, last_menu_id)

    if last_menu:
        logger.info("Generating menu based on the previous week one")
        menus = generate_menu_based_previous_week(last_menu, new_menu_name)
    else:
        logger.info("Generating menu based on random recipes")
        menus = generate_menu_based_random(new_menu_name)

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


def generate_lunch_recipes_list(excluded_recipes):
    current_season = get_current_season_of_the_year()

    # Get all the lunch recipes ids
    excluded_lunch_recipes_ids = [recipe.id for recipe in excluded_recipes]
    # Get all the recipes with meal attribute LUNCH from the database
    # except those that are on the last_weekly_menu_lunch_recipes
    # and sort them randomly
    lunch_recipes = Recipe.objects.filter(meal="LUNCH").order_by("?")
    if current_season == "spring":
        lunch_recipes = (
            Recipe.objects.filter(meal="LUNCH", season_spring=True, active=True)
            .exclude(id__in=excluded_lunch_recipes_ids)
            .order_by("?")
        )
    elif current_season == "summer":
        lunch_recipes = (
            Recipe.objects.filter(meal="LUNCH", season_summer=True, active=True)
            .exclude(id__in=excluded_lunch_recipes_ids)
            .order_by("?")
        )
    elif current_season == "autumn":
        lunch_recipes = (
            Recipe.objects.filter(meal="LUNCH", season_autumn=True, active=True)
            .exclude(id__in=excluded_lunch_recipes_ids)
            .order_by("?")
        )
    else:
        lunch_recipes = (
            Recipe.objects.filter(meal="LUNCH")
            .filter(season_winter=True, active=True)
            .exclude(id__in=excluded_lunch_recipes_ids)
            .order_by("?")
        )
    return lunch_recipes


def get_lunch_recipes(excluded_lunch_recipes):
    lunch_recipes = generate_lunch_recipes_list(excluded_lunch_recipes)
    number_of_lunch_recipes = lunch_recipes.count()
    # If the number of recipes is less than 7, generate a random array of recipes to fill with
    # all the recipes in lunch_recipes. These recipes can be repeated.
    if number_of_lunch_recipes < 7:
        logger.debug("Less than 7 lunch recipes")
        lunch_recipes = generate_lunch_recipes_list([])

    lunch_recipes_ids = [recipe.id for recipe in lunch_recipes]
    lunch_recipes_ids = random.sample(lunch_recipes_ids, k=7)
    logger.debug(f"lunch_recipes_ids: {lunch_recipes_ids}")

    lunch_recipes = Recipe.objects.filter(id__in=lunch_recipes_ids)
    # Filter these recipes between those that are only for weekdays and those that are only for weekends
    weekends = lunch_recipes.filter(days_of_week="WEEKENDS")
    weekdays = lunch_recipes.filter(days_of_week="WEEK_DAYS")
    if len(weekends) == 2 and len(weekdays) == 5:
        # Put the 2 weekend recipes at the end of the queryset
        lunch_recipes = weekdays | weekends

        return lunch_recipes
    all_days = lunch_recipes.filter(days_of_week="ALL")
    if len(all_days) == 7:
        return lunch_recipes

    return None


def get_dinner_recipes(excluded_dinner_recipes):
    # Get all the dinner recipes ids
    excluded_dinner_recipes_ids = [recipe.id for recipe in excluded_dinner_recipes]
    # Get all the recipes with meal attribute DINNER from the database
    # except those that are on the last_weekly_menu_dinner_recipes
    # and sort them randomly
    dinner_recipes = Recipe.objects.filter(meal="DINNER").exclude(id__in=excluded_dinner_recipes_ids).order_by("?")
    number_of_dinner_recipes = dinner_recipes.count()
    if number_of_dinner_recipes < 7:
        logger.debug("Less than 7 dinner recipes")
        dinner_recipes = Recipe.objects.filter(meal="DINNER").order_by("?")

    dinner_recipes_ids = [recipe.id for recipe in dinner_recipes]
    dinner_recipes_ids = random.sample(dinner_recipes_ids, k=7)
    logger.debug(f"dinner_recipes_ids: {dinner_recipes_ids}")

    # Get the recipes from the database using the ids from the lunch_recipes_ids and dinner_recipes_ids lists
    dinner_recipes = Recipe.objects.filter(id__in=dinner_recipes_ids)

    return dinner_recipes


def generate_menu_based_previous_week(last_menu, new_menu_name):
    excluded_lunch_recipes, excluded_dinner_recipes = get_recipes_from_menu(last_menu)

    lunch_recipes = None
    while not lunch_recipes:
        lunch_recipes = get_lunch_recipes(excluded_lunch_recipes)

    dinner_recipes = get_dinner_recipes(excluded_dinner_recipes)

    # Assign the first recipe of the lunch_recipes queryset to the monday_menu object
    monday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Lunes", lunch_recipe=lunch_recipes[0], dinner_recipe=dinner_recipes[0]
    )
    tuesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Martes", lunch_recipe=lunch_recipes[1], dinner_recipe=dinner_recipes[1]
    )
    wednesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Miércoles", lunch_recipe=lunch_recipes[2], dinner_recipe=dinner_recipes[2]
    )
    thursday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Jueves", lunch_recipe=lunch_recipes[3], dinner_recipe=dinner_recipes[3]
    )
    friday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Viernes", lunch_recipe=lunch_recipes[4], dinner_recipe=dinner_recipes[4]
    )
    saturday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Sábado", lunch_recipe=lunch_recipes[5], dinner_recipe=dinner_recipes[5]
    )
    sunday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Domingo", lunch_recipe=lunch_recipes[6], dinner_recipe=dinner_recipes[6]
    )
    return monday_menu, tuesday_menu, wednesday_menu, thursday_menu, friday_menu, saturday_menu, sunday_menu


def generate_menu_based_random(new_menu_name):
    current_season = get_current_season_of_the_year()

    if current_season == "spring":
        lunch_recipes = Recipe.objects.filter(meal="LUNCH", season_spring=True, active=True).order_by("?")
        dinner_recipes = Recipe.objects.filter(meal="DINNER", season_spring=True, active=True).order_by("?")
    elif current_season == "summer":
        lunch_recipes = Recipe.objects.filter(meal="LUNCH", season_summer=True, active=True).order_by("?")
        dinner_recipes = Recipe.objects.filter(meal="DINNER", season_summer=True, active=True).order_by("?")
    elif current_season == "autumn":
        lunch_recipes = Recipe.objects.filter(meal="LUNCH", season_autumn=True, active=True).order_by("?")
        dinner_recipes = Recipe.objects.filter(meal="DINNER", season_autumn=True, active=True).order_by("?")
    else:
        lunch_recipes = Recipe.objects.filter(meal="LUNCH").filter(season_winter=True, active=True).order_by("?")
        dinner_recipes = Recipe.objects.filter(meal="DINNER").filter(season_winter=True, active=True).order_by("?")

    # Get the number of lunch recipes
    number_of_lunch_recipes = lunch_recipes.count()
    # If the number of recipes is less than 7, generate a random array of recipes to
    # fill with all the recipes in lunch_recipes. These recipes can be repeated.
    if number_of_lunch_recipes < 7:
        lunch_recipes = random.sample(list(lunch_recipes), k=7)

    number_of_dinner_recipes = dinner_recipes.count()
    # If the number of recipes is less than 7,
    # generate a random array of recipes to fill with all the recipes in the dinner_recipes queryset.
    # These recipes can be repeated.
    if number_of_dinner_recipes < 7:
        dinner_recipes = random.sample(list(dinner_recipes), k=7)

    # Assign the first recipe of the lunch_recipes queryset to the monday_menu object
    monday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Lunes", lunch_recipe=lunch_recipes[0], dinner_recipe=dinner_recipes[0]
    )
    monday_menu.lunch_recipe = lunch_recipes[0]
    tuesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Martes", lunch_recipe=lunch_recipes[1], dinner_recipe=dinner_recipes[1]
    )
    wednesday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Miércoles", lunch_recipe=lunch_recipes[2], dinner_recipe=dinner_recipes[2]
    )
    thursday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Jueves", lunch_recipe=lunch_recipes[3], dinner_recipe=dinner_recipes[3]
    )
    friday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Viernes", lunch_recipe=lunch_recipes[4], dinner_recipe=dinner_recipes[4]
    )
    saturday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Sábado", lunch_recipe=lunch_recipes[5], dinner_recipe=dinner_recipes[5]
    )
    sunday_menu = DailyMenu.objects.create(
        name=f"{new_menu_name} - Domingo", lunch_recipe=lunch_recipes[6], dinner_recipe=dinner_recipes[6]
    )
    return monday_menu, tuesday_menu, wednesday_menu, thursday_menu, friday_menu, saturday_menu, sunday_menu
