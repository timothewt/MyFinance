"""
URLs access to the API, used by the frontend
"""
from django.contrib import admin
from django.urls import path, include
from wallets.views import MyTokenObtainPairView, WalletAPIView, TransactionAPIView, StockNameAPIView, StockInfoAPIView
from authentication.views import SignUpAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),    # admin page to manage the database
    path("api/token/", MyTokenObtainPairView.as_view(), name="obtain_token"),   # gives the user an access and refresh token when he logs in
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),   # refreshes the access token
    path("api/signup/", SignUpAPIView.as_view(), name="refresh_token"),     # signs up the user in the database
    path('api/wallet/', WalletAPIView.as_view()),   # access to the wallets
    path('api/transactions/', TransactionAPIView.as_view()),    # access to the transactions
    path('api/stockname/<ticker>/', StockNameAPIView.as_view()),    # gives the name of a stock and checks if it exists
    path('api/stockinfos/<ticker>/', StockInfoAPIView.as_view()),    # gives the infos about  a stock and checks if it exists
]
