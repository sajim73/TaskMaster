# Dashboard routes - FIXED VERSION
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.models import Task

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
    
    # FIXED: Add null checks for deadline comparisons
    overdue_tasks = len([
        t for t in tasks 
        if t.deadline and t.deadline.date() < today and t.status == 'Pending'
    ])
    
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
    
    # FIXED: Use proper database filtering with date conversion
    overdue = Task.query.filter(
        Task.deadline != None,
        Task.status == 'Pending'
    ).all()
    
    # Filter in Python with null check
    result = []
    for task in overdue:
        if task.deadline and task.deadline.date() < today:
            result.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category.name if task.category else None,
                'priority': task.priority,
                'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S"),
                'status': task.status
            })
    
    return jsonify(result), 200
