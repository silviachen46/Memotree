# Generated by Django 5.1.3 on 2025-01-01 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0006_topicnode_child_ids"),
    ]

    operations = [
        migrations.AddField(
            model_name="linknode",
            name="position_x",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="linknode",
            name="position_y",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="topicnode",
            name="position_x",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="topicnode",
            name="position_y",
            field=models.FloatField(default=0),
        ),
    ]