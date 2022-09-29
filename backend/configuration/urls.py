from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from wallets.views import WalletViewset, TransactionViewset

router = routers.SimpleRouter()

router.register('wallet', WalletViewset, basename='wallet')
router.register('transaction', TransactionViewset, basename='transaction')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
]
