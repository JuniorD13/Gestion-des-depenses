from django.shortcuts import render
from rest_framework import generics
from .models import Transaction
from .serializers import TransactionSerializers


class TransactionListCreate(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializers
    
class TransactionRetriveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializers
    lookup_field = 'id'
    

# Create your views here.
