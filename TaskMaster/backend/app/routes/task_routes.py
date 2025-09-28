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
    """Get all tasks with optional filtering"""
    # Get query parameters for filtering
    category_id = request.args.get('category_id', type=int)
    status = request.args.get('status')
    priority = request.args.get('priority')

    tasks = get_all_tasks()

    # Apply filters if provided
    if category_id:
        tasks = [t for t in tasks if t.category_id == category_id]
    if status:
        tasks = [t for t in tasks if t.status.lower() == status.lower()]
    if priority:
        tasks = [t for t in tasks if t.priority.lower() == priority.lower()]

    result = []
    for task in tasks:
        result.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'category': task.category.name if task.category else None,
            'category_id': task.category_id,
            'priority': task.priority,
            'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
            'status': task.status,
            'created_at': task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None,
            'updated_at': task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
        })
    return jsonify(result), 200

# ----------------------------
# Get task by ID
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID"""
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    result = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'category': task.category.name if task.category else None,
        'category_id': task.category_id,
        'priority': task.priority,
        'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
        'status': task.status,
        'created_at': task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None,
        'updated_at': task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
    }
    return jsonify(result), 200

# ----------------------------
# Create a new task
# ----------------------------
@task_bp.route('/', methods=['POST'])
def add_task():
    """Create a new task"""
    data = request.get_json()

    # Extract and validate required fields
    title = data.get('title')
    if not title:
        return jsonify({'message': 'Title is required'}), 400

    # Extract optional fields
    description = data.get('description')
    category_id = data.get('category_id')
    priority = data.get('priority', 'Medium')
    deadline = data.get('deadline')

    # Validate priority values
    valid_priorities = ['Low', 'Medium', 'High']
    if priority not in valid_priorities:
        return jsonify({'message': f'Priority must be one of: {", ".join(valid_priorities)}'}), 400

    try:
        task = create_task(title, description, category_id, priority, deadline)
        return jsonify({
            'message': 'Task created successfully',
            'task': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category.name if task.category else None,
                'category_id': task.category_id,
                'priority': task.priority,
                'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
                'status': task.status
            }
        }), 201
    except Exception as e:
        return jsonify({'message': 'Error creating task', 'error': str(e)}), 500

# ----------------------------
# Update a task
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    """Update an existing task"""
    data = request.get_json()

    # Validate priority if provided
    priority = data.get('priority')
    if priority:
        valid_priorities = ['Low', 'Medium', 'High']
        if priority not in valid_priorities:
            return jsonify({'message': f'Priority must be one of: {", ".join(valid_priorities)}'}), 400

    # Validate status if provided
    status = data.get('status')
    if status:
        valid_statuses = ['Pending', 'Completed']
        if status not in valid_statuses:
            return jsonify({'message': f'Status must be one of: {", ".join(valid_statuses)}'}), 400

    try:
        task = update_task(task_id, **data)
        if not task:
            return jsonify({'message': 'Task not found'}), 404

        return jsonify({
            'message': 'Task updated successfully',
            'task': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category.name if task.category else None,
                'category_id': task.category_id,
                'priority': task.priority,
                'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
                'status': task.status,
                'updated_at': task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
            }
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error updating task', 'error': str(e)}), 500

# ----------------------------
# Delete a task
# ----------------------------
@task_bp.route('/<int:task_id>', methods=['DELETE'])
def remove_task(task_id):
    """Delete a task"""
    try:
        success = delete_task(task_id)
        if not success:
            return jsonify({'message': 'Task not found'}), 404

        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error deleting task', 'error': str(e)}), 500

# ----------------------------
# Mark task as complete
# ----------------------------
@task_bp.route('/<int:task_id>/complete', methods=['PATCH'])
def mark_complete(task_id):
    """Mark a task as completed"""
    try:
        task = update_task(task_id, status='Completed')
        if not task:
            return jsonify({'message': 'Task not found'}), 404

        return jsonify({
            'message': 'Task marked as completed',
            'task': {
                'id': task.id,
                'title': task.title,
                'status': task.status,
                'updated_at': task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
            }
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error updating task status', 'error': str(e)}), 500

# ----------------------------
# Mark task as pending
# ----------------------------
@task_bp.route('/<int:task_id>/pending', methods=['PATCH'])
def mark_pending(task_id):
    """Mark a task as pending"""
    try:
        task = update_task(task_id, status='Pending')
        if not task:
            return jsonify({'message': 'Task not found'}), 404

        return jsonify({
            'message': 'Task marked as pending',
            'task': {
                'id': task.id,
                'title': task.title,
                'status': task.status,
                'updated_at': task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
            }
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error updating task status', 'error': str(e)}), 500

# ----------------------------
# Get tasks by status
# ----------------------------
@task_bp.route('/status/<string:status>', methods=['GET'])
def get_tasks_by_status(status):
    """Get all tasks with a specific status"""
    valid_statuses = ['pending', 'completed']
    if status.lower() not in valid_statuses:
        return jsonify({'message': f'Status must be one of: {", ".join(valid_statuses)}'}), 400

    tasks = get_all_tasks()
    filtered_tasks = [t for t in tasks if t.status.lower() == status.lower()]

    result = []
    for task in filtered_tasks:
        result.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'category': task.category.name if task.category else None,
            'category_id': task.category_id,
            'priority': task.priority,
            'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
            'status': task.status,
            'created_at': task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None
        })

    return jsonify({
        'status': status.title(),
        'count': len(result),
        'tasks': result
    }), 200

# ----------------------------
# Get tasks by priority
# ----------------------------
@task_bp.route('/priority/<string:priority>', methods=['GET'])
def get_tasks_by_priority(priority):
    """Get all tasks with a specific priority"""
    valid_priorities = ['low', 'medium', 'high']
    if priority.lower() not in valid_priorities:
        return jsonify({'message': f'Priority must be one of: {", ".join(valid_priorities)}'}), 400

    tasks = get_all_tasks()
    filtered_tasks = [t for t in tasks if t.priority.lower() == priority.lower()]

    result = []
    for task in filtered_tasks:
        result.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'category': task.category.name if task.category else None,
            'category_id': task.category_id,
            'priority': task.priority,
            'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
            'status': task.status,
            'created_at': task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None
        })

    return jsonify({
        'priority': priority.title(),
        'count': len(result),
        'tasks': result
    }), 200
