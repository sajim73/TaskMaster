# Task routes
from flask import Blueprint, request, jsonify
from app.services.task_service import get_all_tasks, get_task_by_id, create_task, update_task, delete_task

# Create Blueprint for tasks
task_bp = Blueprint('tasks', __name__)

# ----------------------------
# Get all tasks
# ----------------------------
@task_bp.route('/', methods=['GET'])
def list_tasks():
    tasks = get_all_tasks()
    result = []
    for task in tasks:
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


# ----------------------------
# Get task by ID
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    result = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'category': task.category.name if task.category else None,
        'priority': task.priority,
        'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
        'status': task.status
    }
    return jsonify(result), 200


# ----------------------------
# Create a new task
# ----------------------------
@task_bp.route('/', methods=['POST'])
def add_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    priority = data.get('priority', 'Medium')
    deadline = data.get('deadline')

    if not title:
        return jsonify({'message': 'Title is required'}), 400

    task = create_task(title, description, category, priority, deadline)
    return jsonify({'message': 'Task created', 'task_id': task.id}), 201


# ----------------------------
# Update a task
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    data = request.get_json()
    task = update_task(task_id, **data)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    return jsonify({'message': 'Task updated'}), 200


# ----------------------------
# Delete a task
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['DELETE'])
def remove_task(task_id):
    success = delete_task(task_id)
    if not success:
        return jsonify({'message': 'Task not found'}), 404
    return jsonify({'message': 'Task deleted'}), 200
