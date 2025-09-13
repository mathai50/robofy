"""Add abuse prevention tables

Revision ID: 003_add_abuse_prevention_tables
Revises: 002_add_api_keys_table
Create Date: 2025-09-11 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '003_add_abuse_prevention_tables'
down_revision = '002_add_api_keys_table'
branch_labels = None
depends_on = None

def upgrade():
    # Create rate_limits table
    op.create_table(
        'rate_limits',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('identifier', sa.String(length=255), nullable=False),
        sa.Column('identifier_type', sa.String(length=20), nullable=False),
        sa.Column('endpoint', sa.String(length=255), nullable=False),
        sa.Column('request_count', sa.Integer(), default=0),
        sa.Column('window_start', sa.DateTime(), default=datetime.now),
        sa.Column('window_end', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), default=datetime.now),
        sa.Column('updated_at', sa.DateTime(), default=datetime.now, onupdate=datetime.now)
    )
    op.create_index('idx_identifier_endpoint', 'rate_limits', ['identifier', 'endpoint'])

    # Create usage_tracking table
    op.create_table(
        'usage_tracking',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('api_key_id', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('endpoint', sa.String(length=255), nullable=False),
        sa.Column('method', sa.String(length=10), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=False),
        sa.Column('response_time', sa.Float(), nullable=True),
        sa.Column('user_agent', sa.String(length=512), nullable=True),
        sa.Column('timestamp', sa.DateTime(), default=datetime.now),
        sa.Column('created_at', sa.DateTime(), default=datetime.now)
    )
    op.create_index('idx_user_timestamp', 'usage_tracking', ['user_id', 'timestamp'])
    op.create_index('idx_api_key_timestamp', 'usage_tracking', ['api_key_id', 'timestamp'])
    op.create_index('idx_ip_timestamp', 'usage_tracking', ['ip_address', 'timestamp'])

    # Create api_access_requests table
    op.create_table(
        'api_access_requests',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('company', sa.String(length=255), nullable=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('requested_tools', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=512), nullable=True),
        sa.Column('granted_access', sa.Boolean(), default=False),
        sa.Column('access_granted_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), default=datetime.now),
        sa.Column('updated_at', sa.DateTime(), default=datetime.now, onupdate=datetime.now)
    )
    op.create_index('idx_email', 'api_access_requests', ['email'])
    op.create_index('idx_granted_access', 'api_access_requests', ['granted_access'])

def downgrade():
    op.drop_table('rate_limits')
    op.drop_table('usage_tracking')
    op.drop_table('api_access_requests')