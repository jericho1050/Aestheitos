# Generated by Django 5.0.1 on 2024-03-28 13:03

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0033_workouts_demo"),
    ]

    operations = [
        migrations.RenameField(
            model_name="section",
            old_name="title",
            new_name="heading",
        ),
        migrations.RenameField(
            model_name="sectionitem",
            old_name="title",
            new_name="heading",
        ),
    ]
