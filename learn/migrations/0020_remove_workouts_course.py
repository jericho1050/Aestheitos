# Generated by Django 5.0.1 on 2024-03-16 15:17

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0019_rename_section_workouts_section_item"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="workouts",
            name="course",
        ),
    ]
