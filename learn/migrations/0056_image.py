# Generated by Django 5.0.1 on 2024-06-11 18:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0055_blog_status"),
    ]

    operations = [
        migrations.CreateModel(
            name="Image",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file", models.ImageField(upload_to="")),
            ],
        ),
    ]
