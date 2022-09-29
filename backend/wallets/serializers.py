from rest_framework import serializers
from .models import Wallet, Transaction


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = ('id', 'owner', 'stocks')


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('id', 'owner', 'date', 'ticker', 'action', 'price', 'qty')
