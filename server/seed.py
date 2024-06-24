#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from sqlalchemy.exc import IntegrityError

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Client, Service, Invoice, InvoiceService, UserClients

fake = Faker()

def create_users():
    users = []
    for _ in range(5):
        user = User(
            username=fake.user_name()
        )
        password = fake.password()
        user.password_hash = password
        print('user', user.username, 'password', password)
        users.append(user)
    return users

def create_clients():
    clients = []
    for _ in range(10):
        client = Client(
            name=fake.name(),
            email=fake.email()
        )
        clients.append(client)
    return clients

def create_services():
    services = []
    for _ in range(10):
        service = Service(
            name=fake.bs()
        )
        services.append(service)
    return services

def create_invoices(clients):
    invoices = []
    for _ in range(20):
        invoice = Invoice(
            client=rc(clients)
        )
        invoices.append(invoice)
    return invoices

def create_invoice_services(invoices, services):
    invoice_services = []
    for invoice in invoices:
        num_services = randint(2, 5)
        for _ in range(num_services):
            invoice_service = InvoiceService(
                invoice=invoice,
                service=rc(services),
                price=round(fake.pyfloat(left_digits=2, right_digits=2, positive=True), 2),
                paid_status=rc([True, False])
            )
            invoice_services.append(invoice_service)
    return invoice_services

def create_user_clients(users, clients):
    user_clients = []
    for user in users:
        num_clients = randint(2, 8)
        client_set = set()
        for _ in range(num_clients):
            client_set.add(rc(clients))
        for client in client_set:
            user_client = UserClients(
                user=user,
                client=client
            )
            user_clients.append(user_client)
    return user_clients



if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        db.drop_all()
        db.create_all()

        print("Clearing db...")
        UserClients.query.delete()
        InvoiceService.query.delete()
        Invoice.query.delete()
        Service.query.delete()
        Client.query.delete()
        User.query.delete()

        print("Seeding Users...")
        users = create_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding Clients...")
        clients = create_clients()
        db.session.add_all(clients)
        db.session.commit()

        print("Seeding Services...")
        services = create_services()
        db.session.add_all(services)
        db.session.commit()

        print("Seeding Invoices...")
        invoices = create_invoices(clients)
        db.session.add_all(invoices)
        db.session.commit()

        print("Seeding InvoiceServices...")
        invoice_services = create_invoice_services(invoices, services)
        db.session.add_all(invoice_services)
        try:
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            print(f"Error seeding InvoiceServices: {e}")

        print("Seeding UserClients...")
        user_clients = create_user_clients(users, clients)
        db.session.add_all(user_clients)
        try:
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            print(f"Error seeding UserClients: {e}")



        print("Done Seeding!")
