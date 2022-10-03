from django.contrib import admin

from .models import Wallet, Transaction


class WalletAdmin(admin.ModelAdmin):
    # Wallet appears with the user in the database
    list_display = ("user",)


class TransactionAdmin(admin.ModelAdmin):
    # Wallet appears with all the infos in the database
    list_display = ("user", "date", "ticker", "action", "price", "qty")


# displays the models in the database
admin.site.register(Wallet, WalletAdmin)
admin.site.register(Transaction, TransactionAdmin)
