from django.utils.timezone import now as date_now
from django.db import models


class Wallet(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.fields.CharField(max_length=20)
    stocks = models.JSONField(default="[]")

    def __str__(self):
        return f'{self.owner}' + '\'s wallet'


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.fields.CharField(max_length=20)
    date = models.fields.DateField(default=date_now)
    ticker = models.fields.CharField(max_length=10, default="")
    ACTION_CHOICE = (
        ('B', 'Buy'),
        ('S', 'Sell')
    )
    action = models.fields.CharField(max_length=1, choices=ACTION_CHOICE, default='B')
    price = models.fields.FloatField(default=0)
    qty = models.fields.IntegerField(default=0)
