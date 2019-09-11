import factory

from backend.models import Category, UnitOfMeasure, Item


class CategoryFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Category


class UnitOfMeasureFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = UnitOfMeasure


class ItemFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Item
