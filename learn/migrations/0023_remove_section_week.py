# Generated by Django 5.0.1 on 2024-03-19 15:58

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0022_alter_section_week"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="section",
            name="week",
        ),
    ]
