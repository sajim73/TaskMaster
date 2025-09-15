# Dashboard routes
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.models import Task
from app import db

dashboard_bp = Blueprint('dashboard', __name__)

# ----------------------------
# Get dashboard overview
# ----------------------------
@dashboard_bp.route('/overview', methods=['GET'])
def dashboard_overview():
    today = datetime.utcnow().date()
    week_end = today + timedelta(days=7)

    tasks = Task.query.all()
    total_tasks = len(tasks)
    pending_tasks = len([t for t in tasks if t.status == 'Pending'])
    completed_tasks = len([t for t in tasks if t.status == 'Completed'])
    overdue_tasks = len([t for t in tasks if t.deadline and t.deadline.date() < today and t.status == 'Pending'])

    upcoming_week_tasks = len([
        t for t in tasks 
        if t.deadline and today <= t.deadline.date() <= week_end
    ])

    overview = {
        'total_tasks': total_tasks,
        'pending_tasks': pending_tasks,
        'completed_tasks': completed_tasks,
        'overdue_tasks': overdue_tasks,
        'upcoming_week_tasks': upcoming_week_tasks
    }

    return jsonify(overview), 200


# ----------------------------
# Get overdue tasks
# ----------------------------
@dashboard_bp.route('/overdue', methods=['GET'])
def get_overdue_tasks():
    today = datetime.utcnow().date()
    overdue = Task.query.filter(Task.deadline < today, Task.status == 'Pending').all()

    result = []
    for task in overdue:
        result.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'category': task.category.name if task.category else None,
            'priority': task.priority,
            'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
            'status': task.status
        })
    return jsonify(result), 200
