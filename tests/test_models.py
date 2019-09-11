import pytest

from backend.models import Category


@pytest.mark.django_db
class TestCategoryModel(object):

    def test_category(self, category):
        assert isinstance(category, Category)

    def test_create_category(self, category_factory):

