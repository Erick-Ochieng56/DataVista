# Generated by Django 5.1.6 on 2025-03-05 11:14

import django.contrib.gis.db.models.fields
import django.contrib.postgres.indexes
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agencies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CrimeCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name_plural': 'Crime Categories',
            },
        ),
        migrations.CreateModel(
            name='CrimeType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('severity_level', models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High'), (4, 'Critical')], default=2)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='crime_types', to='crimes.crimecategory')),
            ],
            options={
                'unique_together': {('category', 'name')},
            },
        ),
        migrations.CreateModel(
            name='Crime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('incident_id', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
                ('occurred_at', models.DateTimeField()),
                ('reported_at', models.DateTimeField()),
                ('data_source', models.CharField(help_text='Source system or feed', max_length=100)),
                ('location', django.contrib.gis.db.models.fields.PointField(geography=True, srid=4326)),
                ('block_address', models.CharField(help_text='Generalized address at block level', max_length=255)),
                ('zip_code', models.CharField(blank=True, max_length=20)),
                ('city', models.CharField(db_index=True, max_length=100)),
                ('state', models.CharField(db_index=True, max_length=50)),
                ('country', models.CharField(default='Kenya', max_length=50)),
                ('verification_status', models.CharField(choices=[('unverified', 'Unverified'), ('verified', 'Verified'), ('suspicious', 'Suspicious Data'), ('corrected', 'Data Corrected')], default='unverified', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True, help_text='Soft delete flag')),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='reported_crimes', to='agencies.agency')),
                ('crime_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='crimes', to='crimes.crimetype')),
            ],
            options={
                'ordering': ['-occurred_at'],
            },
        ),
        migrations.CreateModel(
            name='CrimeAttribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('value', models.JSONField(help_text='Flexible storage for various attribute types')),
                ('crime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attributes', to='crimes.crime')),
            ],
            options={
                'unique_together': {('crime', 'name')},
            },
        ),
        migrations.AddIndex(
            model_name='crime',
            index=models.Index(fields=['occurred_at'], name='crimes_crim_occurre_be36d1_idx'),
        ),
        migrations.AddIndex(
            model_name='crime',
            index=models.Index(fields=['reported_at'], name='crimes_crim_reporte_b97777_idx'),
        ),
        migrations.AddIndex(
            model_name='crime',
            index=models.Index(fields=['verification_status'], name='crimes_crim_verific_22a80c_idx'),
        ),
        migrations.AddIndex(
            model_name='crime',
            index=models.Index(fields=['zip_code'], name='crimes_crim_zip_cod_38e837_idx'),
        ),
        migrations.AddIndex(
            model_name='crime',
            index=models.Index(fields=['city'], name='crimes_crim_city_251979_idx'),
        ),
        migrations.AddIndex(
            model_name='crime',
            index=django.contrib.postgres.indexes.GinIndex(fields=['block_address'], name='crimes_crim_block_a_653b82_gin'),
        ),
    ]
