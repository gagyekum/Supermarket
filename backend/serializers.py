from rest_framework import serializers

from backend.models import Category, UnitOfMeasure, Item


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class UnitOfMeasureSerializer(serializers.ModelSerializer):

    class Meta:
        model = UnitOfMeasure
        fields = ['id', 'name', 'symbol']


class ItemSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data['is_service'] = False
        return super(ItemSerializer, self).create(validated_data=validated_data)

    def validate(self, data):
        if data['unit_price'] < 0:
            raise serializers.ValidationError('Unit price cannot be lower than zero.')
        return data


class ProductSerializer(ItemSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'unit_of_measure', 'unit_price', 'upc']


class ServiceSerializer(ItemSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'unit_price']
