#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Invoice, Client, InvoiceService, Service

# Views go here!

class Index(Resource):

    def get(self):
        response_dict = {
            "_index_": "front page of the secretary web api",
            "users": "/users",

            
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

















api.add_resource(Index, '/')
api.add_resource(Users, '/users')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

