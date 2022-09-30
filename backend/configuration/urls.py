from django.contrib import admin
from django.urls import path, include
from wallets.views import WalletAPIView, TransactionAPIView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/wallet/', WalletAPIView.as_view()),
    path('api/transactions/', TransactionAPIView.as_view()),
]
