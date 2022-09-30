# Generated by Django 4.1.1 on 2022-09-30 21:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('wallets', '0005_alter_wallet_owner_alter_wallet_stocks'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='wallet',
            name='owner',
        ),
        migrations.AddField(
            model_name='transaction',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='wallet',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='wallet',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='wallet',
            name='stocks',
            field=models.JSONField(default='[]'),
        ),
    ]
