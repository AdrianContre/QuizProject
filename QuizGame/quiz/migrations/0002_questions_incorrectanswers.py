# Generated by Django 4.2.3 on 2023-08-04 14:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=64)),
                ('correct_answer', models.CharField(max_length=64)),
                ('question', models.CharField(max_length=200)),
                ('type', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='IncorrectAnswers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(max_length=64)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quiz.questions')),
            ],
        ),
    ]