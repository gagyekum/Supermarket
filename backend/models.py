from django.db import models


class BaseModel(models.Model):

    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class BaseWithSoftDeleteModel(BaseModel):
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True)


class Category(BaseModel):
    name = models.CharField(max_length=50, db_index=True, unique=True, null=False)

    def __str__(self):
        return self.name


class UnitOfMeasure(BaseModel):
    name = models.CharField(max_length=50, db_index=True, unique=True, null=False)
    symbol = models.CharField(max_length=5, null=True)

    def __str__(self):
        return f'{self.name}[{self.symbol if self.symbol else self.name}]'


class Item(BaseWithSoftDeleteModel):
    name = models.CharField(max_length=50, db_index=True, null=False)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, related_name='products')
    unit_of_measure = models.ForeignKey(UnitOfMeasure, on_delete=models.PROTECT, null=True, related_name='products')
    upc = models.CharField(max_length=20, null=True)
    unit_price = models.DecimalField(max_digits=18, decimal_places=4, default=0, null=False)
    is_service = models.BooleanField(default=False, null=False)

    def __str__(self):
        return '{}[{}]'.format(self.name, 'Service' if self.is_service else 'Product')

