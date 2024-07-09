# Generated by Django 4.2 on 2024-07-08 08:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("menus", "0003_alter_recipe_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="is_side_plate",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="recipe",
            name="side_plates",
            field=models.ManyToManyField(to="menus.recipe"),
        ),
    ]