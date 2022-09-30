from django.contrib import admin

from .models import Wallet, Transaction


class WalletAdmin(admin.ModelAdmin):
    list_display = ("owner",)


class TransactionAdmin(admin.ModelAdmin):
    list_display = ("owner", "date", "ticker", "action", "price", "qty")


admin.site.register(Wallet, WalletAdmin)
admin.site.register(Transaction, TransactionAdmin)
