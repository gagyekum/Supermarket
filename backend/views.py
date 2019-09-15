from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response

from backend.models import Category, UnitOfMeasure, Item
from backend import serializers


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    search_fields = ['name']
    ordering_fields = ['name']


class UnitOfMeasureViewSet(viewsets.ModelViewSet):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = serializers.UnitOfMeasureSerializer
    search_fields = ['name', 'symbol']
    ordering_fields = ['name', 'symbol']


class ItemViewSet(viewsets.ModelViewSet):
    search_fields = ['name']
    ordering_fields = ['name', 'unit_price']

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()

        if not item.is_deleted:
            item.is_deleted = True
            item.deleted_at = timezone.now()
            item.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ServiceViewSet(ItemViewSet):
    queryset = Item.objects.filter(is_service=True)
    serializer_class = serializers.ServiceSerializer
    filterset_fields = ['is_deleted', 'category__name']


class ProductViewSet(ItemViewSet):
    queryset = Item.objects.filter(is_service=False)
    serializer_class = serializers.ProductSerializer
    filterset_fields = ['is_deleted', 'category__name', 'unit_of_measure__name']
