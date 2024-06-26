# Generated by Django 5.0.1 on 2024-01-22 13:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0005_rename_set_workouts_sets"),
    ]

    operations = [
        migrations.AlterField(
            model_name="coursecomments",
            name="comment_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comment_comments",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
