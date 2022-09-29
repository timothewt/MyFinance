from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Wallet
from .serializers import *


@api_view(['GET', 'POST'])
def wallets_list(request):
    if request.method == 'GET':
        data = Wallet.objects.all()
        serializer = WalletSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WalletSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
def wallets_detail(request, id):
    try:
        wallet = Wallet.objects.get(id=id)
    except Wallet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
