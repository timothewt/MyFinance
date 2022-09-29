from django.db import models


class Wallet(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.fields.CharField(max_length=20)
    stocks = models.JSONField(default="[]")

    def __str__(self):
        return f'{self.owner}' + '\'s wallet'
