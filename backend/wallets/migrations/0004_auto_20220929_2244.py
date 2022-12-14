# Generated by Django 4.1.1 on 2022-09-29 20:44

from django.db import migrations


def create_data(apps, schema_editor):
    Transaction = apps.get_model('wallets', 'Transaction')
    Transaction(owner='admin', date="2022-09-29", ticker='AMZN', action='B', price=124.28, qty=7).save()
    Transaction(owner='admin', date="2022-09-29", ticker='AAPL', action='B', price=112.98, qty=12).save()
    print(Transaction.objects.all())


class Migration(migrations.Migration):

    dependencies = [
        ('wallets', '0003_transaction_alter_wallet_stocks'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
