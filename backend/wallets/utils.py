import json
import urllib

import yfinance as yf


def formalize_stocks(stocks):
    # adds all the live infos to the stocks, such as current price or growth
    # @param stocks: array of stock in which we add live data
    totalValue = 0
    for stock in stocks:
        current_price, daily_change = get_current_price_daily_change(stock["Ticker"])
        stock['CurrPrice'] = round(current_price, 2)
        stock['DailyChange'] = round(daily_change, 1)
        stock['Growth'] = round(compute_growth(stock['CurrPrice'], stock['AvgCost']), 1)
        stock['ValueGrowth'] = round(compute_value_growth(stock['Qty'], stock['CurrPrice'], stock['AvgCost']), 2)
        stock['Value'] = round(stock['CurrPrice'] * stock['Qty'], 2)
        totalValue = totalValue + stock['Value']
        stock['Name'] = get_yahoo_shortname(stock['Ticker'])
    for stock in stocks:
        stock['Share'] = round(stock['Value'] / totalValue * 100, 1)
    return stocks, totalValue


def compute_value_growth(qty, curr_price, avg_cost):
    # computes the growth value of the stock in the wallet considering the quantity
    # @param qty: quantity of this stock in the wallet
    # @param curr_price: current price of the stock
    # @param avg_cost: average cost of the stock
    return qty * (curr_price - avg_cost)


def compute_growth(curr_price, avg_cost):
    # computes the growth of a stock from its average cost in %
    # @param curr_price: current price of the stock
    # @param avg_cost: average cost of the stock
    return (curr_price / avg_cost * 100) - 100


def get_current_price_daily_change(ticker):
    # gets the current price and the daily change from the yfinance api
    # @param ticker: ticker of the stock
    data = yf.Ticker(ticker).history(period="1d")  # gets the open, high, low, close price of the stock for a day
    curr_price = data['Close'][0]
    daily_change = compute_growth(data['Close'], data['Open'])
    return curr_price, daily_change


def get_yahoo_shortname(ticker):
    # gets the name of the stock from yahoo
    # @param ticker: ticker of the stock
    response = urllib.request.urlopen(f'https://query2.finance.yahoo.com/v1/finance/search?q={ticker}')
    content = response.read()
    data = json.loads(content.decode('utf8'))['quotes'][0]['shortname']
    return data
