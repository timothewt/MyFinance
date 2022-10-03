from rest_framework import serializers
from .models import Wallet, Transaction


class WalletSerializer(serializers.ModelSerializer):
    # Serializes the data of a wallet, i.e. it converts it into a data type that can be converted to JSON by the front
    class Meta:
        model = Wallet
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    # Serializes the data of a transaction
    class Meta:
        model = Transaction
        fields = '__all__'
