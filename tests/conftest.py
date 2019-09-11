from pytest_factoryboy import register

from tests.factories import CategoryFactory, UnitOfMeasureFactory, ItemFactory

register(CategoryFactory)
register(UnitOfMeasureFactory)
register(ItemFactory)
