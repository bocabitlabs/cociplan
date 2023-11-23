# Create your views here.
import json
import logging
import pathlib
from os import path

from menus.models.products import Product

logger = logging.getLogger("cociplan")


def create_initial_products() -> list[Product]:
    json_path = path.join(
        pathlib.Path(__file__).parent.parent.resolve(),
        "data",
        "products.json",
    )
    create_products_list = create_initia_products_from_json(json_path)
    return create_products_list


def create_initia_products_from_json(json_path: str) -> list[Product]:
    products_list: list[Product] = []

    with open(json_path, "r", encoding="utf-8") as file:
        data = file.read()
        data = json.loads(data)
        for product in data:
            # get the product by name
            existing = Product.objects.filter(name=product["name"]).exists()
            if existing:
                logger.debug(f"Product {product['name']} already exists")
                continue
            result = Product.objects.create(
                name=product["name"],
                type=product["type"],
            )
            if result:
                products_list.append(product)
    return products_list
