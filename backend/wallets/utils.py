from datetime import datetime
import json
import urllib

import yfinance as yf
from django.core import serializers

from .models import Wallet, Transaction
from .serializers import TransactionSerializer, WalletSerializer


def format_stocks(stocks):
    # adds all the live infos to the stocks, i.e.
    # the current price, the daily change in %, the growth in %, the value growth, the total value of each stock,
    # the name and the share in the wallet
    # @param stocks: array of stock in which we add live data
    # @return the formatted stocks, the total value of all the stocks
    totalValue = 0
    totalGrowth = 0
    for stock in stocks:
        current_price, daily_change = get_current_price_daily_change(stock["Ticker"])
        stock['CurrPrice'] = round(current_price, 2)
        stock['DailyChange'] = round(daily_change, 1)
        stock['Growth'] = round(compute_growth(stock['CurrPrice'], stock['AvgCost']), 1)
        stock['ValueGrowth'] = round(compute_value_growth(stock['Qty'], stock['CurrPrice'], stock['AvgCost']), 2)
        stock['Value'] = round(stock['CurrPrice'] * stock['Qty'], 2)
        totalValue = totalValue + stock['Value']
        totalGrowth = totalGrowth + stock['ValueGrowth']
        stock['Name'] = get_yahoo_shortname(stock['Ticker'])
    for stock in stocks:
        stock['Share'] = round(stock['Value'] / totalValue * 100, 1)
    totalGrowth = round(totalGrowth, 2)
    totalValue = round(totalValue, 2)
    stocks = sort_stocks_by_value(stocks)
    return stocks, totalValue, totalGrowth


def compute_value_growth(qty, curr_price, avg_cost):
    # computes the growth value of the stock in the wallet considering the quantity
    # @param qty: quantity of this stock in the wallet
    # @param curr_price: current price of the stock
    # @param avg_cost: average cost of the stock
    # @return the value change in currency
    return qty * (curr_price - avg_cost)


def compute_growth(curr_price, avg_cost):
    # computes the growth of a stock from its average cost in %
    # @param curr_price: current price of the stock
    # @param avg_cost: average cost of the stock
    # @return the growth in %
    return (curr_price / avg_cost * 100) - 100


def get_current_price_daily_change(ticker):
    # gets the current price and the daily change from the yfinance api
    # @param ticker: ticker of the stock
    # @return the current price of the stock, the daily variation of the stock
    data = yf.Ticker(ticker).history(period="1d")  # gets the open, high, low, close price of the stock for a day
    curr_price = data['Close'][0]
    daily_change = compute_growth(data['Close'], data['Open'])
    return curr_price, daily_change


def get_yahoo_shortname(ticker):
    # gets the name of the stock from yahoo
    # @param ticker: ticker of the stock
    # @return the complete name of the stock
    response = urllib.request.urlopen(f'https://query2.finance.yahoo.com/v1/finance/search?q={ticker}')
    content = response.read()
    data = json.loads(content.decode('utf8'))['quotes'][0]['shortname']
    return data


def sort_dates(data):
    # sorts a list of json objects with a date field by descending order
    # @param data: list of json to sort
    # @return the sorted json
    return sorted(data, key=lambda transac: datetime.strptime(transac['date'], "%Y-%m-%d"), reverse=True)


def sort_stocks_by_value(stocks):
    return sorted(stocks, key=lambda stock: stock['Value'], reverse=True)


def weighted_avg(qty1, price1, qty2, price2):
    # computes the weighted average of two values
    # @param qty1: quantity of the first element
    # @param price1: first element
    # @param qty2: quantity of the second element
    # @param price2: second element
    # @return the weighted average of the two elements
    return (qty1 * price1 + qty2 * price2) / (qty1 + qty2)


def reverse_weighted_avg(curr_qty, curr_price, t_qty, t_price):
    # gets the reverse weighted average to find the old price of the stock
    # @param curr_qty: current quantity of the stock
    # @param curr_price: current price of the stock
    # @param t_qty: quantity of stock in the transaction
    # @param t_price: price of the stock in the transaction
    # @return the reverse weighted average of the two elements
    return (curr_price * curr_qty - t_qty * t_price) / (curr_qty - t_qty)


def get_serialized_new_transaction(request):
    # serializes the new transaction and formats it correctly
    # @param request: request sent by the user for a new transaction
    # @return the transaction formatted and serialized
    new_transaction = request.data
    new_transaction['user'] = request.user.id   # user is indicated by his id in the transaction object
    transaction_serializer = TransactionSerializer(data=new_transaction)
    transaction_serializer.is_valid(raise_exception=True)
    new_transaction['qty'] = int(new_transaction['qty'])
    new_transaction['price'] = float(new_transaction['price'])
    return new_transaction, transaction_serializer


def get_serialized_wallet_from_userid(id):
    # gets and serializes the wallet of a user
    # @param id: id of the user
    # @return the serialized wallet of the user
    wallet = Wallet.objects.filter(user=id)
    wallet_serializer = WalletSerializer(data=wallet, many=True)
    wallet_serializer.is_valid()
    return wallet_serializer


def get_transaction(id):
    # gets a transaction by its id
    # @param id: id of the transaction
    # @return the transaction
    return Transaction.objects.filter(id=id)
