from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.accessPoint import access_bp
    app.register_blueprint(access_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return {"message": "Welcome to the Pneumonia Detection API"}

    return app
