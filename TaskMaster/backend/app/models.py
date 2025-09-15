# Models for TaskMaster
from datetime import datetime
from app import db

# ----------------------------
# Category Model
# ----------------------------
class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    tasks = db.relationship('Task', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"


# ----------------------------
# Task Model
# ----------------------------
class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    priority = db.Column(db.String(20), nullable=False, default='Medium')  # Low, Medium, High
    deadline = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Pending')  # Pending, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Task {self.title} - {self.status}>"


# ----------------------------
# Settings Model
# ----------------------------
class Settings(db.Model):
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String(20), default='light')      # light or dark
    font_size = db.Column(db.String(10), default='medium') # small, medium, large
    notifications = db.Column(db.Boolean, default=True)    # True = enabled

    def __repr__(self):
        return f"<Settings Theme: {self.theme}, Font: {self.font_size}, Notifications: {self.notifications}>"
