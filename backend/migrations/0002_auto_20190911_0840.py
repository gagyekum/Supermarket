# Generated by Django 2.2.5 on 2019-09-11 08:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='unit_of_measurement',
            new_name='unit_of_measure',
        ),
    ]
