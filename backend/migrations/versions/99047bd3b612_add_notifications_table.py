"""add_notifications_table

Revision ID: 99047bd3b612
Revises: 574f1a0b2b4e
Create Date: 2025-09-12 13:04:01.696554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '99047bd3b612'
down_revision: Union[str, Sequence[str], None] = '574f1a0b2b4e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('channel', sa.String(length=20), nullable=False),
        sa.Column('recipient', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=20), server_default='sent', nullable=False),
        sa.Column('provider_response', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('sent_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('idx_channel', 'notifications', ['channel'])
    op.create_index('idx_recipient', 'notifications', ['recipient'])
    op.create_index('idx_status', 'notifications', ['status'])
    op.create_index('idx_created_at', 'notifications', ['created_at'])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop indexes first
    op.drop_index('idx_channel', table_name='notifications')
    op.drop_index('idx_recipient', table_name='notifications')
    op.drop_index('idx_status', table_name='notifications')
    op.drop_index('idx_created_at', table_name='notifications')
    
    # Drop notifications table
    op.drop_table('notifications')
