# Generated by Django 5.0.1 on 2024-02-22 06:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0014_alter_blogcomments_comment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprogress",
            name="weeks_completed",
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
