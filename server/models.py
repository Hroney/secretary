from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)

    clients = db.relationship('UserClients', back_populates='user')
    services = db.relationship('UserServices', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
        }

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8')
        )
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8')
        )
    
class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)

    invoices = db.relationship('Invoice', back_populates='client', lazy=True)
    users = db.relationship('UserClients', back_populates='client')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'paid_in_total': self.paid_in_total,
            'invoices': [{'id': invoice.id, 'total': round(invoice.total,2), 'paid_in_full': invoice.paid_in_full} for invoice in self.invoices]
        }

    @hybrid_property
    def paid_in_total(self):
        return all(invoice.paid_in_full for invoice in self.invoices)

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    invoices = db.relationship('InvoiceService', back_populates='service')
    users = db.relationship('UserServices', back_populates='service')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'invoices': [invoice.to_dict() for invoice in self.invoices]
        }

class Invoice(db.Model, SerializerMixin):
    __tablename__ = 'invoices'
    serialize_only = ('id', 'client_id', 'total')

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    client = db.relationship('Client', back_populates='invoices', lazy=True)
    services = db.relationship('InvoiceService', back_populates='invoice')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'client': {'id': self.client.id, 'name': self.client.name},
            'total': round(self.total,2),
            'paid_in_full': self.paid_in_full,
            'services': [service.to_dict() for service in self.services]
        }

    @property
    def total(self):
        return sum(service.price for service in self.services)
    
    @hybrid_property
    def paid_in_full(self):
        return all(service.paid_status for service in self.services)

class InvoiceService(db.Model, SerializerMixin):
    __tablename__ = 'invoice_services'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    price = db.Column(db.Float)
    paid_status = db.Column(db.Boolean)
    scheduled_date = db.Column(db.DateTime, default=datetime.utcnow)

    invoice = db.relationship('Invoice', back_populates='services')
    service = db.relationship('Service', back_populates='invoices')

    def to_dict(self):
        return {
            'id': self.id,
            'price': round(self.price, 2),
            'paid_status': self.paid_status,
            'name': self.service.name,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None
        }

class UserClients(db.Model, SerializerMixin):
    __tablename__ = 'user_clients'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

    user = db.relationship('User', back_populates='clients')
    client = db.relationship('Client', back_populates='users')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'client_id': self.client_id
        }

class UserServices(db.Model, SerializerMixin):
    __tablename__ = 'user_services'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))

    user = db.relationship('User', back_populates='services')
    service = db.relationship('Service', back_populates='users')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service_id': self.service_id,
        }
