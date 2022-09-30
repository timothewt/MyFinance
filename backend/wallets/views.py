import json
import yfinance as yf
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer


def formalize_stocks(stocks):
    totalValue = 0
    tickers = {}
    get_available_tickers(tickers)
    for stock in stocks:
        stock['CurrPrice'] = round(yf.Ticker(stock["Ticker"]).history(period="1d")['Close'][0], 2)
        stock['Growth'] = round((stock['CurrPrice'] / stock['AvgCost'] * 100) - 100, 1)
        stock['Value'] = round(stock['CurrPrice'] * stock['Qty'], 2)
        totalValue = totalValue + stock['Value']
        stock['Name'] = tickers[stock['Ticker']]
    for stock in stocks:
        stock['Share'] = round(stock['Value'] / totalValue * 100, 1)
    return stocks


def get_available_tickers(tickers):
    with open('../tickers.txt') as f:
        for line in f:
            ticker = line[:-1].split(',')
            tickers[ticker[0]] = ticker[1]


class WalletAPIView(APIView):
    def get(self, *args, **kwargs):
        wallet = Wallet.objects.filter(owner=self.request.user)
        serializer = WalletSerializer(wallet, many=True)
        try:
            stocks = json.loads(json.dumps(serializer.data[0]['stocks']))  # retrieving the stocks into a list of jsons
            serializer.data[0]['stocks'] = formalize_stocks(stocks)
        except:
            pass

        return Response(serializer.data)


class TransactionAPIView(APIView):
    def get(self, *args, **kwargs):
        transactions = Transaction.objects.filter(owner=self.request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
