"""Initial migration

Revision ID: 001_initial_migration
Revises: 
Create Date: 2025-09-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '001_initial_migration'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('username', sa.String(length=50), nullable=False, unique=True, index=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_superuser', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), default=datetime.now),
        sa.Column('updated_at', sa.DateTime(), default=datetime.now, onupdate=datetime.now)
    )

    # Create leads table
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('score', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(), default=datetime.now),
        sa.Column('updated_at', sa.DateTime(), default=datetime.now, onupdate=datetime.now)
    )

    # Create content table
    op.create_table(
        'content',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=50), default='draft'),
        sa.Column('created_at', sa.DateTime(), default=datetime.now),
        sa.Column('published_at', sa.DateTime(), nullable=True)
    )

def downgrade():
    op.drop_table('content')
    op.drop_table('leads')
    op.drop_table('users')