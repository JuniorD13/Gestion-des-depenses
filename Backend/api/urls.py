from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('transactions/', views.TransactionListCreate.as_view()),
    path('transactions/<uuid:id>/', views.TransactionRetriveUpdateDestroy.as_view()),
]
