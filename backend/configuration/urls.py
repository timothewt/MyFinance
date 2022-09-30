from django.contrib import admin
from django.urls import path, include
from wallets.views import MyTokenObtainPairView, WalletAPIView, TransactionAPIView
from authentication.views import SignUpAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/token/", MyTokenObtainPairView.as_view(), name="obtain_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/signup/", SignUpAPIView.as_view(), name="refresh_token"),
    path('api/auth/', include('rest_framework.urls')),
    path('api/wallet/', WalletAPIView.as_view()),
    path('api/transactions/', TransactionAPIView.as_view()),
]
