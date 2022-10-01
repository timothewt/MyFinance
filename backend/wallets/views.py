import json
import urllib
from datetime import datetime

import yfinance as yf
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import WalletSerializer, TransactionSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):  # adds username to tokens
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


def formalize_stocks(stocks):
    totalValue = 0
    for stock in stocks:
        current_price, daily_change = get_current_price_daily_change(stock)
        stock['CurrPrice'] = round(current_price, 2)
        stock['DailyChange'] = round(daily_change, 1)
        stock['Growth'] = round((stock['CurrPrice'] / stock['AvgCost'] * 100) - 100, 1)
        stock['ValueGrowth'] = round(stock['Qty'] * (stock['CurrPrice'] - stock['AvgCost']), 2)
        stock['Value'] = round(stock['CurrPrice'] * stock['Qty'], 2)
        totalValue = totalValue + stock['Value']
        stock['Name'] = get_yahoo_shortname(stock['Ticker'])
    for stock in stocks:
        stock['Share'] = round(stock['Value'] / totalValue * 100, 1)
    return stocks, totalValue


def get_current_price_daily_change(stock):
    data = yf.Ticker(stock["Ticker"]).history(period="1d")
    curr_price = data['Close'][0]
    daily_change = (data['Close'] / data['Open']) * 100 - 100
    return curr_price, daily_change


def get_yahoo_shortname(symbol):
    response = urllib.request.urlopen(f'https://query2.finance.yahoo.com/v1/finance/search?q={symbol}')
    content = response.read()
    data = json.loads(content.decode('utf8'))['quotes'][0]['shortname']
    return data


@permission_classes([IsAuthenticated])
class WalletAPIView(APIView):
    def get(self, *args, **kwargs):
        user = self.request.user
        wallet = user.wallet_set.all()
        serializer = WalletSerializer(wallet, many=True)
        if self.request.user.is_authenticated:
            stocks = json.loads(json.dumps(serializer.data[0]['stocks']))  # retrieving the stocks into a list of jsons
            serializer.data[0]['stocks'], serializer.data[0]['totalValue'] = formalize_stocks(stocks)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class TransactionAPIView(APIView):
    def get(self, *args, **kwargs):
        user = self.request.user
        transactions = user.transaction_set.all()
        serializer = TransactionSerializer(transactions, many=True)
        for transaction in serializer.data:
            transaction['name'] = get_yahoo_shortname(transaction['ticker'])
        sorted_transactions = sorted(serializer.data, key=lambda transac: datetime.strptime(transac['date'], "%Y-%m-%d"), reverse=True)
        return Response(sorted_transactions)
