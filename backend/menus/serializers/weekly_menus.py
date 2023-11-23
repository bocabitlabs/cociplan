import logging

from menus.models.daily_menus import DailyMenu
from menus.models.weekly_menus import WeeklyMenu
from menus.serializers.daily_menus import DailyMenuSerializer
from rest_framework import serializers

logger = logging.getLogger("cociplan")


class WeeklyMenuSerializer(serializers.ModelSerializer):
    monday_menu = DailyMenuSerializer()
    tuesday_menu = DailyMenuSerializer()
    wednesday_menu = DailyMenuSerializer()
    thursday_menu = DailyMenuSerializer()
    friday_menu = DailyMenuSerializer()
    saturday_menu = DailyMenuSerializer()
    sunday_menu = DailyMenuSerializer()

    class Meta:
        model = WeeklyMenu
        fields = [
            "id",
            "name",
            "monday_menu",
            "tuesday_menu",
            "wednesday_menu",
            "thursday_menu",
            "friday_menu",
            "saturday_menu",
            "sunday_menu",
            "date_created",
            "last_updated",
        ]


class WeeklyMenuWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyMenu
        fields = []


class WeeklyMenuPatchSerializer(serializers.ModelSerializer):
    monday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    tuesday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    wednesday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    thursday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    friday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    saturday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())
    sunday_menu = serializers.PrimaryKeyRelatedField(queryset=DailyMenu.objects.all())

    class Meta:
        model = DailyMenu
        fields = [
            "name",
            "monday_menu",
            "tuesday_menu",
            "wednesday_menu",
            "thursday_menu",
            "friday_menu",
            "saturday_menu",
            "sunday_menu",
        ]
