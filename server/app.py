#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
from datetime import datetime
# Add your model imports
from models import db, User, Invoice, Client, InvoiceService, Service, UserClients, UserServices

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
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return {"message": "Username and password are required"}, 400

            if User.query.filter_by(username=username).first():
                return {"message": "User already exists"}, 400

            new_user = User(username=username)
            new_user.password_hash = password

            db.session.add(new_user)
            db.session.commit()

            return new_user.to_dict(), 201

        except Exception as e:
            return {"message": str(e)}, 500




class Clients(Resource):
    def get(self):
        clients = Client.query.all()
        clients_dict = [client.to_dict() for client in clients]
        return clients_dict, 200

    def post(self):
        try:
            data = request.json
            required_fields = ['name', 'email']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400

            new_client = Client(
                name = data['name'],
                email = data['email']
            )
            db.session.add(new_client)
            db.session.commit()

            return new_client.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500

class Services(Resource):
    def get(self):
        services = Service.query.all()
        services_dict = [service.to_dict() for service in services]
        return services_dict, 200
    def post(self):
        try:
            data = request.json
            required_fields = ['name']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400

            new_service = Service(
                name = data['name']
            )
            db.session.add(new_service)
            db.session.commit()

            return new_service.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500


class Invoices(Resource):
    def get(self):
        invoices = Invoice.query.all()
        invoices_dict = [invoice.to_dict() for invoice in invoices]
        return invoices_dict, 200

    def post(self):
        try:
            data = request.json
            required_fields = ['client_id', 'user_id']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400

            new_invoice = Invoice(
                client_id = data['client_id'],
                user_id = data['user_id']
            )
            db.session.add(new_invoice)
            db.session.commit()

            return new_invoice.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500

class InvoiceServices(Resource):
    def get(self):
        invoices = InvoiceService.query.all()
        invoices_dict = [invoice.to_dict() for invoice in invoices]
        return invoices_dict, 200

    def post(self):
        try:
            data = request.json
            required_fields = ['invoice_id', 'service_id', 'price', 'paid_status', 'scheduled_date']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400

            try:
                scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
            except ValueError:
                return {'error': 'Invalid date format. Use ISO format (e.g., "2024-07-06T16:31:54.044096").'}, 400

            new_invoice_service = InvoiceService(
                invoice_id=data['invoice_id'],
                service_id=data['service_id'],
                price=data['price'],
                paid_status=data['paid_status'],
                scheduled_date=scheduled_date
            )
            db.session.add(new_invoice_service)
            db.session.commit()

            return new_invoice_service.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500

class InvoiceServicesById(Resource):
    def get(self, id):
        invoice = InvoiceService.query.filter_by(id=id).first()
        return invoice.to_dict(), 200

    def patch(self, id):
        try:
            record = InvoiceService.query.filter_by(id=id).first()
            for attr in request.json:
                setattr(record, attr, request.json[attr])
            db.session.add(record)
            db.session.commit()
            return record.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error {e} occured'}, 500

class Login(Resource):
    def post(self):
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            return {'message': 'login successful', 'userId': user.id}, 200
        else:
            return {'message': 'Invalid credentials'}, 401

class ClientsByUserID(Resource):
    def get(self, user_id):
        clients = UserClients.query.filter_by(user_id=user_id).all()
        clients_dict = [[client.to_dict(), client.client.to_dict()] for client in clients]
        return clients_dict, 200
    def delete(self, user_id):
        try:
            data = request.json
            required_fields = ['user_id', 'client_id']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400
            user_client = UserClients.query.filter_by(user_id=user_id, client_id=data['client_id']).first()
            if not user_client:
                return {'error': 'Service not found for this user'}, 404
            db.session.delete(user_client)
            db.session.commit()
            return {'message': 'Service successfully deleted'}, 200
        except Exception as e:
                db.session.rollback()
                return {'error': f'An error occurred while processing the request: {e}'}, 500
    def post(self, user_id):
        try:
            data = request.json
            new_user_client = UserClients(
                client_id = data,
                user_id = user_id
            )

            db.session.add(new_user_client)
            db.session.commit()

            return new_user_client.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500

class ClientByID(Resource):
    def get(self, id):
        client = Client.query.filter_by(id=id).first()
        return client.to_dict(), 200
    def patch(self, id):
        try:
            record = Client.query.filter_by(id=id).first()
            for attr in request.json:
                setattr(record, attr, request.json[attr])
            db.session.add(record)
            db.session.commit()
            return record.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error {e} occured'}, 500


class InvoicesByClientID(Resource):
    def get(self, client_id):
        invoices = Invoice.query.filter_by(client_id=client_id).all()
        invoice_dict = [invoice.to_dict() for invoice in invoices]
        return invoice_dict, 200



class Schedule(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            clients = UserClients.query.filter_by(user_id=user.id).all()
            schedule = []
            for client in clients:
                invoices = Invoice.query.filter_by(client_id=client.client_id).all()
                for invoice in invoices:
                    invoice_dict = invoice.to_dict()
                    if id == invoice_dict['user_id']:
                        services_list = invoice_dict['services']
                        for service in services_list:
                            schedule.append({
                                'client': invoice_dict['client'],
                                'service': service['name'],
                                'scheduled_date': service['scheduled_date'] if service['scheduled_date'] else None,
                                'client_service_list' : services_list,
                                'invoice_service_id': service['id']
                            })

            return schedule, 200
        else:
            return jsonify({'error': 'User not found'}), 404

class ServicesByUser(Resource):
    def get(self, id):
        services = UserServices.query.filter_by(user_id=id).all()
        services_dict = [service.to_dict()['service_id'] for service in services]
        service_list = [Service.query.filter_by(id=service).first() for service in services_dict]
        service_list_dict = [service.to_dict() for service in service_list]
        return service_list_dict, 200

    def post(self, id):
        try:
            data = request.json
            required_fields = ['service_id']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400

            new_service = UserServices(
                service_id = data['service_id'],
                user_id = id
            )

            db.session.add(new_service)
            db.session.commit()

            return new_service.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred while processing the request: {e}'}, 500
    def patch(self, id):
        try:
            record = Service.query.filter_by(id=id).first()
            for attr in request.json:
                setattr(record, attr, request.json[attr])
            db.session.add(record)
            db.session.commit()
            return record.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error {e} occured'}, 500
    def delete(self, id):
        try:
            data = request.json
            required_fields = ['id']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field {field}'}, 400
            user_service = UserServices.query.filter_by(user_id=id, service_id=data['id']).first()
            if not user_service:
                return {'error': 'Service not found for this user'}, 404
            db.session.delete(user_service)
            db.session.commit()
            return {'message': 'Service successfully deleted'}, 200
        except Exception as e:
                db.session.rollback()
                return {'error': f'An error occurred while processing the request: {e}'}, 500



api.add_resource(Index, '/')
api.add_resource(Users, '/users')
api.add_resource(Clients, '/clients')
api.add_resource(Services, '/services')
api.add_resource(Invoices, '/invoices')
api.add_resource(InvoiceServices, '/invoice_services')
api.add_resource(InvoiceServicesById, '/invoice_service/<int:id>')
api.add_resource(ClientsByUserID, '/clients_by_user_id/<int:user_id>')
api.add_resource(ClientByID, '/client_by_id/<int:id>')
api.add_resource(InvoicesByClientID, '/invoices_by_client_id/<int:client_id>')
api.add_resource(Login, '/login')
api.add_resource(Schedule, '/schedule/<int:id>')
api.add_resource(ServicesByUser, '/services_by_user_id/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
