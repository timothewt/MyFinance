"""
Models of the app objects, Wallet with stocks and Transaction with all the infos (date, price, ..)
"""
from django.utils.timezone import now as date_now
from django.db import models
from django.contrib.auth.models import User


class Wallet(models.Model):
    # Wallet model which contains the owner of the wallet and the stocks
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # The user is the standard django user
    stocks = models.JSONField(default=[])   # The stocks are stored in a json


class Transaction(models.Model):
    # Transaction model which contains all the info of a transaction (buying or selling a stock)
    id = models.AutoField(primary_key=True)     # id of the transaction to identify it
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)     # user who made the transaction
    date = models.fields.DateField(default=date_now)    # date of the transaction, the user picks it
    ticker = models.fields.CharField(max_length=10, default="")     # ticker of the stock
    ACTION_CHOICE = (
        ("B", "Buy"),
        ("S", "Sell")
    )
    action = models.fields.CharField(max_length=1, choices=ACTION_CHOICE, default="B")  # the transaction is either a buy or a sell
    price = models.fields.FloatField(default=0)  # price of each stock bought or sold
    qty = models.fields.IntegerField(default=0)  # qty of stock bought or sold
