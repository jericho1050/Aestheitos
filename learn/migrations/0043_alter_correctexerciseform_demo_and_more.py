# Generated by Django 5.0.1 on 2024-05-04 02:13

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learn", "0042_alter_correctexerciseform_description_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="correctexerciseform",
            name="demo",
            field=models.ImageField(upload_to="correct_exercise_form/"),
        ),
        migrations.AlterField(
            model_name="user",
            name="profile_pic",
            field=models.ImageField(
                blank=True, null=True, upload_to="profile_pictures/"
            ),
        ),
        migrations.AlterField(
            model_name="workouts",
            name="demo",
            field=models.ImageField(upload_to="workouts/"),
        ),
        migrations.AlterField(
            model_name="wrongexerciseform",
            name="demo",
            field=models.ImageField(upload_to="wrong_exercise_form/"),
        ),
    ]
