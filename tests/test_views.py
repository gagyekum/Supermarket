import pytest
import functools
from django.conf import settings
from django.db.models import Q
from django.urls import reverse
from rest_framework import status

from backend.models import Category, UnitOfMeasure, Item

throttle_classes = settings.REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES']
throttle_rates = settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']

settings.REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = []
settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {}


@pytest.mark.django_db
class TestCategoryView(object):

    def test_create_category(self, client):
        response = client.post(reverse('category-list'), {'name': 'category_1'}, 'json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_duplicate_category(self, category, client):
        response = client.post(reverse('category-list'), {'name': category.name}, 'json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_category(self, category, client):
        name = 'updated_category_name'
        response = client.put(reverse('category-detail', kwargs={'pk': category.id}), {'name': name}, 'json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('name') == name

    def test_delete_category(self, category, client):
        response = client.delete(reverse('category-detail', kwargs={'pk': category.id}))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.parametrize('page', [1, 2, 3, 4, 5])
    def test_get_categories(self, client, category_factory, page):
        count = 50
        for index in range(count):
            category_factory.create(name='category_%d' % index)

        response = client.get(reverse('category-list'), {'page': page, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('count') == count
        assert len(response.data.get('results')) == settings.REST_FRAMEWORK['PAGE_SIZE']

    @pytest.mark.parametrize('ordering', ['name', '-name'])
    def test_ordering_categories(self, client, category_factory, ordering):
        for index in range(50):
            category_factory.create(name='category_%d' % index)

        response = client.get(reverse('category-list'), {'ordering': ordering})

        assert response.status_code == status.HTTP_200_OK
        assert Category.objects.order_by(ordering).first().id == response.data.get('results')[0]['id']

    @pytest.mark.parametrize('search', ['category_0',
                                        'category_1',
                                        'category_2',
                                        'category_3',
                                        'category_4',
                                        'category_5'])
    def test_search_categories(self, client, category_factory, search):
        for index in range(50):
            category_factory.create(name='category_%d' % index)

        response = client.get(reverse('category-list'), {'search': search, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert Category.objects.filter(name__icontains=search).count() == response.data.get('count')


@pytest.mark.django_db
class TestUnitOfMeasureView(object):

    def test_create_unit_of_measure(self, client):
        response = client.post(reverse('unit-list'), {'name': 'unit_1', 'symbol': 'Ut'}, 'json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_create_unit_of_measure_with_empty_symbol(self, client):
        response = client.post(reverse('unit-list'), {'name': 'unit_1'}, 'json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_duplicate_unit_of_measure(self, unit_of_measure, client):
        response = client.post(reverse('unit-list'), {'name': unit_of_measure.name}, 'json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_unit_of_measure(self, unit_of_measure, client):
        name = 'updated_unit_name'
        response = client.put(reverse('unit-detail', kwargs={'pk': unit_of_measure.id}), {'name': name}, 'json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('name') == name

    def test_delete_unit_of_measure(self, unit_of_measure, client):
        response = client.delete(reverse('unit-detail', kwargs={'pk': unit_of_measure.id}))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.parametrize('page', [1, 2, 3, 4, 5])
    def test_get_unit_of_measure(self, client, unit_of_measure_factory, page):
        count = 50
        for index in range(count):
            unit_of_measure_factory.create(name='unit_%d' % index)

        response = client.get(reverse('unit-list'), {'page': page, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('count') == count
        assert len(response.data.get('results')) == settings.REST_FRAMEWORK['PAGE_SIZE']

    @pytest.mark.parametrize('ordering', ['name', '-name', 'symbol', '-symbol'])
    def test_ordering_unit_of_measure(self, client, unit_of_measure_factory, ordering):
        for index in range(50):
            unit_of_measure_factory.create(name='unit_%d' % index, symbol='sy_%d' % index)

        response = client.get(reverse('unit-list'), {'ordering': ordering})

        assert response.status_code == status.HTTP_200_OK
        assert UnitOfMeasure.objects.order_by(ordering).first().id == response.data.get('results')[0]['id']

    @pytest.mark.parametrize('search', ['unit_0',
                                        'unit_1',
                                        'unit_2',
                                        'unit_3',
                                        'unit_4',
                                        'unit_5',
                                        'sy_0',
                                        'sy_1',
                                        'sy_2',
                                        'sy_3',
                                        'sy_4',
                                        'sy_5'])
    def test_search_unit_of_measure(self, client, unit_of_measure_factory, search):
        for index in range(50):
            unit_of_measure_factory.create(name='unit_%d' % index, symbol='sy_%d' % index)

        response = client.get(reverse('unit-list'), {'search': search, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert UnitOfMeasure.objects.filter(Q(name__icontains=search) |
                                            Q(symbol__icontains=search)).count() == response.data.get('count')


@pytest.mark.django_db
class TestProductView(object):

    @pytest.fixture
    def product(self, category, unit_of_measure):
        return {
            'name': 'new_product',
            'category': category.id,
            'unit_of_measure': unit_of_measure.id,
            'unit_price': '25.0000',
            'upc': '23847293487'
        }

    def test_create_product(self, product, client):
        response = client.post(reverse('product-list'), product, 'json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_negative_unit_price_product(self, product, client):
        product['unit_price'] = -35.0000

        response = client.post(reverse('product-list'), product, 'json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_product(self, item, product, category, unit_of_measure, client):
        product['name'] = 'update_name'
        product['category'] = category.id
        product['unit_of_measure'] = unit_of_measure.id
        product['unit_price'] = '95.0000'
        product['upc'] = '340459830958'

        response = client.put(reverse('product-detail', kwargs={'pk': item.id}), product, 'json')
        expected_product = response.data

        assert response.status_code == status.HTTP_200_OK
        assert expected_product['name'] == product['name']
        assert expected_product['category'] == product['category']
        assert expected_product['unit_of_measure'] == product['unit_of_measure']
        assert expected_product['unit_price'] == product['unit_price']
        assert expected_product['upc'] == product['upc']

    def test_delete_product(self, item_factory, client):
        product = item_factory.create(is_service=False)
        response = client.delete(reverse('product-detail', kwargs={'pk': product.id}))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Item.objects.filter(id=product.id).exists()

    @pytest.mark.parametrize('page', [1, 2, 3, 4, 5])
    def test_get_products(self, item_factory, client, page):
        count = 50
        for index in range(count):
            item_factory.create(name='product_%d' % index)

        response = client.get(reverse('product-list'), {'page': page, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('count') == count
        assert len(response.data.get('results')) == settings.REST_FRAMEWORK['PAGE_SIZE']

    @pytest.mark.parametrize('ordering', ['name', '-name', 'unit_price', '-unit_price'])
    def test_ordering_products(self, client, item_factory, ordering):
        for index in range(50):
            item_factory.create(name='product_%d' % index, unit_price=index * 10.78, is_service=False)

        response = client.get(reverse('product-list'), {'ordering': ordering})

        assert response.status_code == status.HTTP_200_OK
        assert Item.objects.order_by(ordering).first().id == response.data.get('results')[0]['id']

    @pytest.mark.parametrize('search', ['product_0',
                                        'product_1',
                                        'product_2',
                                        'product_3',
                                        'product_4',
                                        'product_5'])
    def test_search_product(self, client, item_factory, search):
        for index in range(50):
            item_factory.create(name='product_%d' % index, unit_price=index * 10.78, is_service=False)

        response = client.get(reverse('product-list'), {'search': search, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert Item.objects.filter(name__icontains=search).count() == response.data.get('count')


@pytest.mark.django_db
class TestServiceView(object):

    @pytest.fixture
    def service(self, category, unit_of_measure):
        return {
            'name': 'new_product',
            'category': category.id,
            'unit_price': '25.0000'
        }

    def test_create_service(self, service, client):
        response = client.post(reverse('service-list'), service, 'json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_negative_unit_price_service(self, service, client):
        service['unit_price'] = -35.0000

        response = client.post(reverse('service-list'), service, 'json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_service(self, item_factory, service, category, client):
        item = item_factory.create(is_service=True)

        service['name'] = 'update_name'
        service['category'] = category.id
        service['unit_price'] = '95.0000'

        response = client.put(reverse('service-detail', kwargs={'pk': item.id}), service, 'json')
        expected_service = response.data

        assert response.status_code == status.HTTP_200_OK
        assert expected_service['name'] == service['name']
        assert expected_service['category'] == service['category']
        assert expected_service['unit_price'] == service['unit_price']

    def test_delete_service(self, item_factory, client):
        service = item_factory.create(is_service=True)
        response = client.delete(reverse('service-detail', kwargs={'pk': service.id}))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Item.objects.filter(id=service.id).exists()

    @pytest.mark.parametrize('page', [1, 2, 3, 4, 5])
    def test_get_services(self, item_factory, client, page):
        count = 50
        for index in range(count):
            item_factory.create(name='service_%d' % index, is_service=True)

        response = client.get(reverse('service-list'), {'page': page, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('count') == count
        assert len(response.data.get('results')) == settings.REST_FRAMEWORK['PAGE_SIZE']

    @pytest.mark.parametrize('ordering', ['name', '-name', 'unit_price', '-unit_price'])
    def test_ordering_services(self, client, item_factory, ordering):
        for index in range(50):
            item_factory.create(name='service_%d' % index, unit_price=index * 10.78, is_service=True)

        response = client.get(reverse('service-list'), {'ordering': ordering})

        assert response.status_code == status.HTTP_200_OK
        assert Item.objects.order_by(ordering).first().id == response.data.get('results')[0]['id']

    @pytest.mark.parametrize('search', ['product_0',
                                        'product_1',
                                        'product_2',
                                        'product_3',
                                        'product_4',
                                        'product_5'])
    def test_search_service(self, client, item_factory, search):
        for index in range(50):
            item_factory.create(name='service_%d' % index, unit_price=index * 10.78, is_service=True)

        response = client.get(reverse('service-list'), {'search': search, 'ordering': 'name'})

        assert response.status_code == status.HTTP_200_OK
        assert Item.objects.filter(name__icontains=search).count() == response.data.get('count')



