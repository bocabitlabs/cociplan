from django.db import models

from menus.models.daily_menus import DailyMenu


# https://pypi.org/project/django-types/
# Create your models here.
class WeeklyMenu(models.Model):
    id = models.BigAutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=200)

    monday_menu_id: int
    monday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="mondays"
    )
    tuesday_menu_id: int
    tuesday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="tuesdays"
    )
    wednesday_menu_id: int
    wednesday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="wednesdays"
    )
    thursday_menu_id: int
    thursday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="thursdays"
    )
    friday_menu_id: int
    friday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="fridays"
    )
    saturday_menu_id: int
    saturday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="saturdays"
    )
    sunday_menu_id: int
    sunday_menu = models.ForeignKey["DailyMenu", DailyMenu](
        DailyMenu, on_delete=models.CASCADE, related_name="sundays"
    )

    date_created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_updated"]
        verbose_name = "Daily Menu"
        verbose_name_plural = "Daily Menus"

    def __str__(self) -> str:
        return f"{self.name} - {self.date_created}"
