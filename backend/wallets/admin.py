from django.contrib import admin

from .models import Wallet


class WalletAdmin(admin.ModelAdmin):
    list_display = ("owner",)


admin.site.register(Wallet, WalletAdmin)
