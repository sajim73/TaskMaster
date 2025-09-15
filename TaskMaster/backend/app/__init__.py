# Flask app init

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize database instance
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskmaster.db'  # Local SQLite
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key'  # Change this for production

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import routes
    from app.routes.task_routes import task_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.calendar_routes import calendar_bp
    from app.routes.report_routes import report_bp
    from app.routes.settings_routes import settings_bp

    # Register blueprints
    app.register_blueprint(task_bp, url_prefix='/tasks')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(calendar_bp, url_prefix='/calendar')
    app.register_blueprint(report_bp, url_prefix='/reports')
    app.register_blueprint(settings_bp, url_prefix='/settings')

    return app

