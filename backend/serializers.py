from rest_framework import serializers, status
from rest_framework.exceptions import ErrorDetail

from backend.models import Category, UnitOfMeasure, Item


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class UnitOfMeasureSerializer(serializers.ModelSerializer):

    class Meta:
        model = UnitOfMeasure
        fields = ['id', 'name', 'symbol']


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'unit_of_measure', 'unit_price', 'upc']

    def create(self, validated_data):
        validated_data['is_service'] = False
        super(ProductSerializer, self).create(validated_data=validated_data)

    def validate(self, attrs):
        unit_price = attrs.get('unit_price')
        if unit_price < 0:
            super(ProductSerializer, self).errors['unit_price'] = \
                [ErrorDetail('No data provided', code=status.HTTP_400_BAD_REQUEST)]

        super(ProductSerializer, self).validate(attrs)


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'unit_price']

    def create(self, validated_data):
        validated_data['is_service'] = True
        super(ServiceSerializer, self).create(validated_data=validated_data)

    def validate(self, attrs):
        unit_price = attrs.get('unit_price')
        if unit_price < 0:
            super(ServiceSerializer, self).errors['unit_price'] = \
                [ErrorDetail('No data provided', code=status.HTTP_400_BAD_REQUEST)]

        super(ServiceSerializer, self).validate(attrs)



