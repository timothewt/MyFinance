"""
Serializes data, i.e. it converts it into a data type that can be converted to JSON by the front
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Wallet, Transaction


class WalletSerializer(serializers.ModelSerializer):
    # Serializes the data of a wallet
    class Meta:
        model = Wallet
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    # Serializes the data of a transaction
    class Meta:
        model = Transaction
        fields = '__all__'


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # adds the username to the data inside the encrypted tokens
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username   # adds the username field
        return token
