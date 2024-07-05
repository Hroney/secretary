"""add scheduled_date to InvoiceService

Revision ID: 97607e341c54
Revises: 72c0e4ffd378
Create Date: 2024-06-26 10:33:09.552823

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '97607e341c54'
down_revision = '72c0e4ffd378'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('invoice_services', schema=None) as batch_op:
        batch_op.add_column(sa.Column('scheduled_date', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('invoice_services', schema=None) as batch_op:
        batch_op.drop_column('scheduled_date')

    # ### end Alembic commands ###