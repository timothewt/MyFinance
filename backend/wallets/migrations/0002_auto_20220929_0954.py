from django.db import migrations


def create_data(apps, schema_editor):
    Wallet = apps.get_model('wallets', 'Wallet')
    Wallet(owner='admin', stocks="[{'Ticker': 'AAPL', 'Exchange': '', 'AvgCost': 112.98, 'Qty': 12},"
                                 "{'Ticker': 'AMZN', 'Exchange': '', 'AvgCost': 124.28, 'Qty': 7}]").save()
    print(Wallet.objects.all())


class Migration(migrations.Migration):
    dependencies = [
        ('wallets', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
