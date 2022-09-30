# Generated by Django 4.1.1 on 2022-09-29 20:41

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('wallets', '0002_auto_20220929_0954'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('owner', models.CharField(max_length=20)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('ticker', models.CharField(default='', max_length=10)),
                ('action', models.CharField(choices=[('B', 'Buy'), ('S', 'Sell')], default='B', max_length=1)),
                ('price', models.FloatField(default=0)),
                ('qty', models.IntegerField(default=0)),
            ],
        ),
        migrations.AlterField(
            model_name='wallet',
            name='stocks',
            field=models.JSONField(default='[]'),
        ),
    ]