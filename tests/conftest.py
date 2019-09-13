import pytest
from pytest_factoryboy import register
from rest_framework.test import APIClient

from tests.factories import CategoryFactory, UnitOfMeasureFactory, ItemFactory

register(CategoryFactory)
register(UnitOfMeasureFactory)
register(ItemFactory)


@pytest.fixture
def client():
    return APIClient()
