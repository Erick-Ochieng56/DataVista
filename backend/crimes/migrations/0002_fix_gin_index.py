from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('crimes', '0001_initial'),  # Make sure this points to your previous migration
    ]

    operations = [
        # Add pg_trgm extension
        migrations.RunSQL(
            "CREATE EXTENSION IF NOT EXISTS pg_trgm;",
            "DROP EXTENSION IF EXISTS pg_trgm;"
        ),
        # Create GIN index with proper operator class
        migrations.RunSQL(
            "CREATE INDEX block_address_gin_idx ON crimes_crime USING gin (block_address gin_trgm_ops);",
            "DROP INDEX IF EXISTS block_address_gin_idx;"
        ),
    ]