# Generated by Django 5.0.1 on 2024-03-19 15:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0021_section_week"),
    ]

    operations = [
        migrations.AlterField(
            model_name="section",
            name="week",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]