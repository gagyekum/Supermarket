import datetime
from decimal import Decimal

import pytest
import pytz
from django.db import IntegrityError
from django.db.models import ProtectedError

from backend.models import Category, UnitOfMeasure, Item


@pytest.mark.django_db
class TestCategoryModel(object):

    def test_category(self, category):
        assert isinstance(category, Category)

    def test_create_category(self, category):
        assert Category.objects.filter(id=category.id).exists()

    def test_create_duplicate_category(self, category, category_factory):
        with pytest.raises(IntegrityError):
            category_factory.create(name=category.name)

    def test_create_no_name_category(self, category_factory):
        with pytest.raises(IntegrityError):
            category_factory.create(name=None)

    def test_update_category(self, category):
        new_category_name = 'updated_category_name'
        category.name = new_category_name
        category.save()

        assert Category.objects.filter(id=category.id).first().name == new_category_name

    def test_delete_category(self, category):
        category.delete()
        assert not Category.objects.filter(id=category.id).exists()

    def test_delete_bound_category(self, category, item_factory):
        item_factory.create(category=category)

        with pytest.raises(ProtectedError):
            category.delete()


@pytest.mark.django_db
class TestUnitOfMeasureModel(object):

    def test_unit_of_measure(self, unit_of_measure):
        assert isinstance(unit_of_measure, UnitOfMeasure)

    def test_create_unit_of_measure(self, unit_of_measure):
        assert UnitOfMeasure.objects.filter(id=unit_of_measure.id).exists()

    def test_create_unit_of_measure_without_symbol(self, unit_of_measure_factory):
        unit_of_measure = unit_of_measure_factory.create(symbol=None)
        expected_unit_of_measure = UnitOfMeasure.objects.filter(id=unit_of_measure.id).first()

        assert expected_unit_of_measure.name == unit_of_measure.name
        assert not expected_unit_of_measure.symbol
        assert expected_unit_of_measure.symbol == unit_of_measure.symbol

    def test_create_unit_of_measure_with_long_symbol(self, unit_of_measure_factory):
        unit_of_measure = unit_of_measure_factory.create(symbol='GHUUUUUU')
        assert UnitOfMeasure.objects.filter(id=unit_of_measure.id).first().symbol == unit_of_measure.symbol

    def test_create_duplicate_unit_of_measure(self, unit_of_measure, unit_of_measure_factory):
        with pytest.raises(IntegrityError):
            unit_of_measure_factory.create(name=unit_of_measure.name)

    def test_no_name_unit_of_measure(self, unit_of_measure_factory):
        with pytest.raises(IntegrityError):
            unit_of_measure_factory.create(name=None)

    def test_update_unit_of_measure(self, unit_of_measure):
        name = 'updated_unit'
        symbol = 'update_symbol'

        unit_of_measure.name = name
        unit_of_measure.symbol = symbol
        unit_of_measure.save()

        expected_unit_of_measure = UnitOfMeasure.objects.filter(id=unit_of_measure.id).first()

        assert expected_unit_of_measure.name == unit_of_measure.name
        assert expected_unit_of_measure.symbol == unit_of_measure.symbol

    def test_delete_unit_of_measure(self, unit_of_measure):
        unit_of_measure.delete()
        assert not UnitOfMeasure.objects.filter(id=unit_of_measure.id).exists()

    def test_delete_bound_unit_of_measure(self, unit_of_measure, item_factory):
        item_factory.create(unit_of_measure=unit_of_measure)

        with pytest.raises(ProtectedError):
            unit_of_measure.delete()


@pytest.mark.django_db
class TestItemModel(object):

    def test_item(self, item):
        assert isinstance(item, Item)

    def test_create_item(self, item):
        assert Item.objects.filter(id=item.id).exists()

    def test_create_no_name_item(self, item_factory):
        with pytest.raises(IntegrityError):
            item_factory.create(name=None)

    def test_create_duplicate_item_name(self, item, item_factory):
        duplicate_item = item_factory.create(name=item.name)
        assert item.name == duplicate_item.name

    def test_create_item_with_category(self, category, item_factory):
        item = item_factory.create(category=category)

        assert Item.objects.filter(id=item.id).first().category == category
        assert item in Category.objects.filter(id=category.id).first().products.iterator()

    def test_create_item_with_unit_of_measure(self, unit_of_measure, item_factory):
        item = item_factory.create(unit_of_measure=unit_of_measure)

        assert Item.objects.filter(id=item.id).first().unit_of_measure == unit_of_measure
        assert item in UnitOfMeasure.objects.filter(id=unit_of_measure.id).first().products.iterator()

    def test_create_item_as_service(self, item_factory):
        item = item_factory.create(is_service=True)
        assert Item.objects.filter(id=item.id).first().is_service == item.is_service

    def test_update_item(self, item, category, unit_of_measure):
        name = 'update_name'
        unit_price = Decimal(45.0000)
        is_service = False
        upc = '1234556875959090'

        item.name = name
        item.unit_price = unit_price
        item.is_service = is_service
        item.upc = upc
        item.category = category
        item.unit_of_measure = unit_of_measure
        item.save()

        expect_item = Item.objects.filter(id=item.id).first()

        assert expect_item.name == name
        assert expect_item.unit_price == unit_price
        assert expect_item.is_service == is_service
        assert expect_item.upc == upc
        assert expect_item.category == category
        assert expect_item.unit_of_measure == unit_of_measure

    def test_delete_item(self, item):
        item.delete()
        assert not Item.objects.filter(id=item.id).exists()

    def test_flag_item_deleted(self, item):
        deleted_at = datetime.datetime.utcnow().replace(tzinfo=pytz.timezone('UTC'))

        item.is_deleted = True
        item.deleted_at = deleted_at
        item.save()

        expected_item = Item.objects.filter(id=item.id).first()

        assert expected_item.is_deleted == True
        assert expected_item.deleted_at == deleted_at






