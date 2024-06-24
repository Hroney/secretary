#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Invoice, Client, InvoiceService, Service, UserClients

# Views go here!

class Index(Resource):

    def get(self):
        response_dict = {
            "0_index": "front page of the secretary web api",
            "1_users": "/users",
            "2_clients": "/clients",
            "3_services": "/services",
            "4_invoices": "/invoices",
            "5_invoice services": "/invoice_services",

            
        }
        response = make_response(
            response_dict,
            200,
        )
        return response

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_dict = [user.to_dict() for user in users]
        return user_dict, 200

class Clients(Resource):
    def get(self):
        clients = Client.query.all()
        clients_dict = [client.to_dict() for client in clients]
        return clients_dict, 200

class Services(Resource):
    def get(self):
        services = Service.query.all()
        services_dict = [service.to_dict() for service in services]
        return services_dict, 200

class Invoices(Resource):
    def get(self):
        invoices = Invoice.query.all()
        invoices_dict = [invoice.to_dict() for invoice in invoices]
        return invoices_dict, 200

class InvoiceServices(Resource):
    def get(self):
        invoices = InvoiceService.query.all()
        invoices_dict = [invoice.to_dict() for invoice in invoices]
        return invoices_dict, 200

class Login(Resource):
    def post(self):
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        print(user.authenticate(password))
        if user and user.authenticate(password):
            return {'message': 'login successful', 'userId': user.id}, 200
        else:
            return {'message': 'Invalid credentials'}, 401







api.add_resource(Index, '/')
api.add_resource(Users, '/users')
api.add_resource(Clients, '/clients')
api.add_resource(Services, '/services')
api.add_resource(Invoices, '/invoices')
api.add_resource(InvoiceServices, '/invoice_services')
api.add_resource(Login, '/login')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

