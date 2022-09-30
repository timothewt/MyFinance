from django.utils.timezone import now as date_now
from django.db import models
from django.contrib.auth.models import User


class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    stocks = models.JSONField(default=[])


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date = models.fields.DateField(default=date_now)
    ticker = models.fields.CharField(max_length=10, default="")
    ACTION_CHOICE = (
        ("B", "Buy"),
        ("S", "Sell")
    )
    action = models.fields.CharField(max_length=1, choices=ACTION_CHOICE, default="B")
    price = models.fields.FloatField(default=0)
    qty = models.fields.IntegerField(default=0)
