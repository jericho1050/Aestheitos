# Generated by Django 5.0.1 on 2024-05-06 16:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0044_sectionitem_description_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="is_draft",
            field=models.BooleanField(default=True),
        ),
    ]
