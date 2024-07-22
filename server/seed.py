#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta

import os
import tempfile

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Client, Service, Invoice, InvoiceService, UserClients

fake = Faker()

TEMP_FILE_PATH = 'user_secrets.txt'

def create_users():
    users = []

    # Open the file for writing (this will overwrite any existing data)
    with open('user_secrets.txt', 'w') as temp_file:
        for _ in range(5):
            user = User(
                username=fake.user_name()
            )
            password = fake.password()
            user.password_hash = password
            
            # Write the username and password to the file
            temp_file.write(f'User: {user.username}, Password: {password}\n')
            
            users.append(user)

    print("User data written to user_secrets.txt")
    
    return users


def create_clients():
    clients = []
    for _ in range(20):
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

def create_invoices_and_services(clients, services):
    invoices = []
    invoice_services = []
    
    for client in clients:
        num_invoices = randint(1, 5)
        for _ in range(num_invoices):
            invoice = Invoice(
                client=client
            )
            invoices.append(invoice)
            
            scheduled_date = fake.date_time_between(start_date='-30d', end_date='+30d')
            num_services = randint(2, 5)
            for _ in range(num_services):
                invoice_service = InvoiceService(
                    invoice=invoice,
                    service=rc(services),
                    price=round(fake.pyfloat(left_digits=2, right_digits=2, positive=True), 2),
                    paid_status=rc([True, False]),
                    scheduled_date=scheduled_date
                )
                invoice_services.append(invoice_service)
    
    return invoices, invoice_services

def create_user_clients(users, clients):
    user_clients = []
    for user in users:
        num_clients = randint(5, 10)
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

        print("Seeding Invoices and InvoiceServices...")
        invoices, invoice_services = create_invoices_and_services(clients, services)
        db.session.add_all(invoices)
        db.session.add_all(invoice_services)
        try:
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            print(f"Error seeding Invoices and InvoiceServices: {e}")

        print("Seeding UserClients...")
        user_clients = create_user_clients(users, clients)
        db.session.add_all(user_clients)
        try:
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            print(f"Error seeding UserClients: {e}")

        print("Done Seeding!")
