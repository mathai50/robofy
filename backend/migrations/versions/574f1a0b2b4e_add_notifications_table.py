"""add_notifications_table

Revision ID: 574f1a0b2b4e
Revises: 003_add_abuse_prevention_tables
Create Date: 2025-09-12 13:03:27.957569

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '574f1a0b2b4e'
down_revision: Union[str, Sequence[str], None] = '003_add_abuse_prevention_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
