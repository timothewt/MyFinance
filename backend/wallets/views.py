from rest_framework.viewsets import ModelViewSet

from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer


class WalletViewset(ModelViewSet):
    serializer_class = WalletSerializer

    def get_queryset(self):
        return Wallet.objects.all()


class TransactionViewset(ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.all()
