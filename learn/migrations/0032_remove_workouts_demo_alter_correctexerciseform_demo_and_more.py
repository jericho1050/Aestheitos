# Generated by Django 5.0.1 on 2024-03-26 17:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0031_alter_course_course_created"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="workouts",
            name="demo",
        ),
        migrations.AlterField(
            model_name="correctexerciseform",
            name="demo",
            field=models.ImageField(upload_to=""),
        ),
        migrations.AlterField(
            model_name="wrongexerciseform",
            name="demo",
            field=models.ImageField(upload_to=""),
        ),
    ]
