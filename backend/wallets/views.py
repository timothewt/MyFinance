from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .utils import *


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
        serializer.data[0]['stocks'], serializer.data[0]['totalValue'], serializer.data[0]['totalGrowth'] = format_stocks(stocks)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])  # The view can be accessed only if the user is authenticated
class TransactionAPIView(APIView):
    # transactions access by the REST API
    def options(self, *args, **kwargs):
        # cancels a past transaction
        # @return a response status, 200 if the transactions has been canceled, 400 otherwise
        if self.request.data['action'] != 'cancel':
            return Response(status=status.HTTP_400_BAD_REQUEST)
        transaction = get_transaction(self.request.data['transaction-id'])
        json_transaction = json.loads(serializers.serialize("json", transaction))
        transaction_data = json_transaction[0]['fields']
        wallet = get_serialized_wallet_from_userid(self.request.user.id)
        user_stocks = wallet.data[0]["stocks"]
        if transaction_data['action'] == 'B':   # if the transaction was a Buy, it computes the past avg cost and updates the quantity
            for stock in user_stocks:
                if stock['Ticker'] == transaction_data['ticker']:
                    if stock['Qty'] == transaction_data['qty']:
                        user_stocks.pop(user_stocks.index(stock))
                    else:
                        stock['AvgCost'] = round(reverse_weighted_avg(stock['Qty'], stock['AvgCost'], transaction_data['qty'], transaction_data['price']), 2)
                        stock['Qty'] = stock['Qty'] - transaction_data['qty']
                    break
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:   # if the transaction was a Sell, just add the quantity sold again
            for stock in user_stocks:
                if stock['Ticker'] == transaction_data['ticker']:
                    stock['Qty'] = stock['Qty'] + transaction_data['qty']
                    break
            else:   # if all the stocks were sold, re-creates it
                user_stocks.append({"Ticker": transaction_data['ticker'],
                                    "AvgCost": transaction_data['price'],
                                    "Qty": transaction_data['qty']})
        Wallet.objects.filter(user=self.request.user.id).update(stocks=user_stocks)
        transaction.delete()
        return Response(status=status.HTTP_200_OK)

    def get(self, *args, **kwargs):
        # retrieves all the transactions of the user, serializes them and adds the full name of the stock
        # @return the serialized transactions data to the front-end
        user = self.request.user
        transactions = user.transaction_set.all()
        serializer = TransactionSerializer(transactions, many=True)
        for transaction in serializer.data:
            transaction['name'] = get_yahoo_shortname(transaction['ticker'])
        sorted_transactions = sort_dates(serializer.data)  # sorts the transactions by descending date order
        return Response(sorted_transactions)

    def post(self, request, *args, **kwargs):
        # posts a new transaction in the database and updates the wallet of the user from it
        # @return no data but the status of the request
        new_transaction, transaction_serializer = get_serialized_new_transaction(request)
        wallet_serializer = get_serialized_wallet_from_userid(request.user.id)
        user_stocks = wallet_serializer.data[0]['stocks']
        if new_transaction['action'] == 'B':    # Buy option
            for stock in user_stocks:   # if the stock has been found, updates the avg cost and the quantity
                if stock['Ticker'] == new_transaction['ticker']:
                    stock['AvgCost'] = round(weighted_avg(stock['Qty'], stock['AvgCost'], new_transaction['qty'], new_transaction['price']), 2)
                    stock['Qty'] = stock['Qty'] + new_transaction['qty']
                    break
            else:   # else it is added into the wallet
                user_stocks.append({"Ticker": new_transaction['ticker'],
                                    "AvgCost": new_transaction['price'],
                                    "Qty": new_transaction['qty']})
        else:   # Sell option
            for stock in user_stocks:
                if stock['Ticker'] == new_transaction['ticker']:
                    if new_transaction['qty'] < stock['Qty']:   # if there is enough stock to sell updates the quantity
                        stock['Qty'] = stock['Qty'] - new_transaction['qty']
                    elif new_transaction['qty'] == stock['Qty']:    # if the user sells all the stocks
                        user_stocks.pop(user_stocks.index(stock))
                    else:   # if there is not enough stocks
                        return Response({}, status=status.HTTP_400_BAD_REQUEST)
                    break
            else:   # if the stock has not been found
                return Response({}, status=status.HTTP_404_NOT_FOUND)
        transaction_serializer.save()
        wallet_serializer.data[0]['stocks'] = user_stocks
        Wallet.objects.filter(user=request.user.id).update(stocks=user_stocks)
        return Response({}, status=status.HTTP_200_OK)


class StockNameAPIView(APIView):
    def get(self, *args, **kwargs):
        # gets the name of a stock from its ticker in the url
        # @param **kwargs: data in the url
        # @return [bool: has the stock been found, str: if found stock name else error]
        ticker = self.kwargs['ticker']
        response = [False, ""]
        try:
            get_current_price_daily_change(ticker)  # the stock is valid if the price can be retrieved
            response[0] = True
            response[1] = get_yahoo_shortname(ticker)
        except Exception:
            response[1] = "Error: Stock not found"
        return Response(response)
