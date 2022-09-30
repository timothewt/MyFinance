import json
import urllib
import yfinance as yf
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Wallet, Transaction
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
    tickers = {}
    get_available_tickers(tickers)
    for stock in stocks:
        stock['CurrPrice'] = round(yf.Ticker(stock["Ticker"]).history(period="1d")['Close'][0], 2)
        stock['Growth'] = round((stock['CurrPrice'] / stock['AvgCost'] * 100) - 100, 1)
        stock['Value'] = round(stock['CurrPrice'] * stock['Qty'], 2)
        totalValue = totalValue + stock['Value']
        stock['Name'] = get_yahoo_shortname(stock['Ticker'])
    for stock in stocks:
        stock['Share'] = round(stock['Value'] / totalValue * 100, 1)
    return stocks


def get_yahoo_shortname(symbol):
    response = urllib.request.urlopen(f'https://query2.finance.yahoo.com/v1/finance/search?q={symbol}')
    content = response.read()
    data = json.loads(content.decode('utf8'))['quotes'][0]['shortname']
    return data


def get_available_tickers(tickers):
    with open('../tickers.txt') as f:
        for line in f:
            ticker = line[:-1].split(',')
            tickers[ticker[0]] = ticker[1]


class WalletAPIView(APIView):
    def get(self, *args, **kwargs):
        wallet = Wallet.objects.filter(owner=self.request.user)
        serializer = WalletSerializer(wallet, many=True)
        if self.request.user.is_authenticated:
            stocks = json.loads(json.dumps(serializer.data[0]['stocks']))  # retrieving the stocks into a list of jsons
            serializer.data[0]['stocks'] = formalize_stocks(stocks)
        return Response(serializer.data)


class TransactionAPIView(APIView):
    def get(self, *args, **kwargs):
        transactions = Transaction.objects.filter(owner=self.request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
