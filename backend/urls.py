from rest_framework import routers

from backend import views

default_router = routers.DefaultRouter(trailing_slash=False)
default_router.register('categories', views.CategoryViewSet)
default_router.register('units', views.UnitOfMeasureViewSet)
default_router.register('services', views.ServiceViewSet, basename='service')
default_router.register('products', views.ProductViewSet, basename='product')

urlpatterns = default_router.urls
