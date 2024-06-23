from flask import Flask
from .routes import main as main_blueprint
from .database import db


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/mydatabase'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(main_blueprint)

    with app.app_context():
        db.create_all()  # Create database tables for our data models

    return app
