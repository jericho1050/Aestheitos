# Generated by Django 5.0.1 on 2024-03-19 17:07

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0024_sectionitem_title"),
    ]

    operations = [
        migrations.RenameField(
            model_name="sectionitem",
            old_name="overview",
            new_name="description",
        ),
    ]
