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
from models import db, User, Client, Service, Invoice, InvoiceService, UserClients, UserServices

fake = Faker()

TEMP_FILE_PATH = 'user_secrets.txt'

def create_users():
    users = []

    # Open the file for writing (this will overwrite any existing data)
    with open(TEMP_FILE_PATH, 'w') as temp_file:
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

def create_user_services(services, users):
    userservices = []
    for user in users:
        for service in services:
            if rc([True, False]):  # Randomly decide if this user gets this service
                userservice = UserServices(
                    user_id=user.id,
                    service_id=service.id
                )
                userservices.append(userservice)
    return userservices

def create_user_clients(users, clients):
    user_clients = []
    for user in users:
        num_clients = randint(5, 10)
        client_set = set(rc(clients) for _ in range(num_clients)) 
        for client in client_set:
            user_client = UserClients(
                user=user,
                client=client
            )
            user_clients.append(user_client)
    return user_clients

def create_invoices(clients, user_clients):
    invoices = []
    user_client_dict = {(uc.user_id, uc.client_id) for uc in user_clients}
    for client in clients:
        client_user_ids = [uid for uid, cid in user_client_dict if cid == client.id]
        num_invoices = randint(1,5)
        if client_user_ids:
            for _ in range(num_invoices):
                invoice = Invoice(
                    client_id=client.id,
                    user_id=rc(client_user_ids),
                    )
                invoices.append(invoice)
    return invoices


def create_invoices_services(invoices, clients, services, user_services, user_clients):
    invoice_services = []
    user_service_dict = {(us.user_id, us.service_id) for us in user_services}
    user_client_dict = {(uc.user_id, uc.client_id) for uc in user_clients}

    for client in clients:
        for invoice in invoices:
            if client.id == invoice.client_id:
                user_id = invoice.user_id
                user_service_ids = [sid for uid, sid in user_service_dict if uid == user_id]
                
                scheduled_date = fake.date_time_between(start_date='-30d', end_date='+30d')
                num_services = randint(2, 5)

                for _ in range(num_services):
                    service = rc(user_service_ids)
                    invoice_service = InvoiceService(
                        invoice_id=invoice.id,
                        service_id=service,
                        price=round(fake.pyfloat(left_digits=2, right_digits=2, positive=True), 2),
                        paid_status=rc([True, False]),
                        scheduled_date=scheduled_date
                    )
                    invoice_services.append(invoice_service)
    return invoice_services

def commit_with_session(objects):
    db.session.add_all(objects)
    try:
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        print(f"Error committing data: {e}")

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
        commit_with_session(users)

        print("Seeding Clients...")
        clients = create_clients()
        commit_with_session(clients)

        print("Seeding Services...")
        services = create_services()
        commit_with_session(services)

        print("Seeding User Services...")
        user_services = create_user_services(services, users)
        commit_with_session(user_services)

        print("Seeding User Clients...")
        user_clients = create_user_clients(users, clients)
        commit_with_session(user_clients)

        print("Seeding Invoices...")
        invoices = create_invoices(clients, user_clients)
        commit_with_session(invoices)

        print("Seeding Invoices and InvoiceServices...")
        invoice_services = create_invoices_services(invoices, clients, services, user_services, user_clients)
        commit_with_session(invoice_services)

        print("Done Seeding!")
