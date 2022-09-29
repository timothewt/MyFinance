from django.contrib import admin
from django.urls import path, include, re_path
from wallets import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/wallets/$', views.wallets_list),
    re_path(r'^api/wallets/([0-9])$', views.wallets_detail),
]
