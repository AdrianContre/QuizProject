# Generated by Django 4.2.3 on 2023-08-04 15:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0002_questions_incorrectanswers'),
    ]

    operations = [
        migrations.AddField(
            model_name='questions',
            name='created_on',
            field=models.DateField(default=datetime.datetime.now),
        ),
    ]