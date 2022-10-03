import json
from datetime import datetime

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import WalletSerializer, TransactionSerializer
from .utils import formalize_stocks, get_yahoo_shortname, get_current_price_daily_change


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # adds the username to the data inside the encrypted tokens
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username   # adds the username field
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    # sets the serializer for the token pair
    serializer_class = MyTokenObtainPairSerializer


@permission_classes([IsAuthenticated])  # The view can be accessed only if the user is authenticated
class WalletAPIView(APIView):
    # wallet access by the REST API
    def get(self, *args, **kwargs):
        # retrieves the wallet of the user, serializes it and adds all the live fields such as the current price
        # @return the serialized wallet with complete data to the front-end
        user = self.request.user
        wallet = user.wallet_set.all()
        serializer = WalletSerializer(wallet, many=True)
        stocks = json.loads(json.dumps(serializer.data[0]['stocks']))  # retrieving the stocks into a list of jsons
        serializer.data[0]['stocks'], serializer.data[0]['totalValue'] = formalize_stocks(stocks)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])  # The view can be accessed only if the user is authenticated
class TransactionAPIView(APIView):
    # transactions access by the REST API
    def get(self, *args, **kwargs):
        # retrieves all the transactions of the user, serializes them and adds the full name of the stock
        # @return the serialized transactions data to the front-end
        user = self.request.user
        transactions = user.transaction_set.all()
        serializer = TransactionSerializer(transactions, many=True)
        for transaction in serializer.data:
            transaction['name'] = get_yahoo_shortname(transaction['ticker'])
        sorted_transactions = sorted(serializer.data, key=lambda transac: datetime.strptime(transac['date'], "%Y-%m-%d"), reverse=True)  # sorts the transactions by descending date order
        return Response(sorted_transactions)


class StockNameAPIView(APIView):
    def get(self, *args, **kwargs):
        ticker = self.kwargs['ticker']
        response = [False, ""]  # response = [has the stock been found, if yes stock name else error]
        try:
            get_current_price_daily_change(ticker)  # the stock is valid if the price can be retrieved
            response[0] = True
            response[1] = get_yahoo_shortname(ticker)
        except Exception:
            response[1] = "Error: Stock not found"
        return Response(response)
