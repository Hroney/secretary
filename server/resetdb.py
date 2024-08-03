from sqlalchemy.exc import IntegrityError
from app import app
from models import db, User, Client, Service, Invoice, InvoiceService, UserClients, UserServices

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()

        print("Database has been cleared.")
