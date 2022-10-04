from rest_framework import serializers
from django.contrib.auth.models import User
from wallets.models import Wallet


class SignUpSerializer(serializers.ModelSerializer):
    # serializes the user data when signing up
    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        # creates a user and his wallet in the database
        # @param validated_data: data of the new user retrieved in the front-end
        user = User.objects.create_user(username=validated_data['username'], password=validated_data['password'])
        wallet = Wallet()
        wallet.user = user
        wallet.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    # serializes the user
    class Meta:
        model = User
        fields = ('username', 'password')
