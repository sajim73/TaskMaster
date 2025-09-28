# Category routes - FIXED VERSION
from flask import Blueprint, request, jsonify
from app.models import Category, Task
from app import db

category_bp = Blueprint('categories', __name__)

# ----------------------------
# Get all categories
# ----------------------------
@category_bp.route('/', methods=['GET'])
def list_categories():
    """Get all categories with task counts"""
    categories = Category.query.all()
    result = []
    
    for category in categories:
        task_count = Task.query.filter_by(category_id=category.id).count()
        result.append({
            'id': category.id,
            'name': category.name,
            'task_count': task_count
        })
    
    return jsonify(result), 200

# ----------------------------
# Get category by ID - FIXED ROUTE
# ----------------------------
@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a specific category with its tasks"""
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    # Get tasks in this category
    tasks = Task.query.filter_by(category_id=category.id).all()
    task_list = []
    
    for task in tasks:
        task_list.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'priority': task.priority,
            'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S") if task.deadline else None,
            'status': task.status
        })
    
    result = {
        'id': category.id,
        'name': category.name,
        'task_count': len(task_list),
        'tasks': task_list
    }
    
    return jsonify(result), 200

# ----------------------------
# Create a new category
# ----------------------------
@category_bp.route('/', methods=['POST'])
def create_category():
    """Create a new category"""
    data = request.get_json()
    
    # FIXED: Add JSON validation
    if not data:
        return jsonify({'message': 'JSON payload required'}), 400
    
    name = data.get('name')
    if not name:
        return jsonify({'message': 'Category name is required'}), 400
    
    # Check if category already exists
    existing_category = Category.query.filter_by(name=name).first()
    if existing_category:
        return jsonify({'message': 'Category already exists'}), 409
    
    try:
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': {
                'id': category.id,
                'name': category.name,
                'task_count': 0
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating category', 'error': str(e)}), 500

# ----------------------------
# Update a category - FIXED ROUTE
# ----------------------------
@category_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update an existing category"""
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    data = request.get_json()
    
    # FIXED: Add JSON validation
    if not data:
        return jsonify({'message': 'JSON payload required'}), 400
    
    name = data.get('name')
    if not name:
        return jsonify({'message': 'Category name is required'}), 400
    
    # Check if another category with this name exists
    existing_category = Category.query.filter(
        Category.name == name,
        Category.id != category_id
    ).first()
    
    if existing_category:
        return jsonify({'message': 'Category name already exists'}), 409
    
    try:
        category.name = name
        db.session.commit()
        
        task_count = Task.query.filter_by(category_id=category.id).count()
        
        return jsonify({
            'message': 'Category updated successfully',
            'category': {
                'id': category.id,
                'name': category.name,
                'task_count': task_count
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating category', 'error': str(e)}), 500

# ----------------------------
# Delete a category - FIXED ROUTE
# ----------------------------
@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category and handle associated tasks"""
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    try:
        # Check if there are tasks assigned to this category
        tasks_in_category = Task.query.filter_by(category_id=category.id).count()
        
        if tasks_in_category > 0:
            # Set category_id to NULL for all tasks in this category
            # This preserves tasks but removes category association
            Task.query.filter_by(category_id=category.id).update({Task.category_id: None})
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category deleted successfully',
            'tasks_affected': tasks_in_category
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting category', 'error': str(e)}), 500

# ----------------------------
# Get category statistics
# ----------------------------
@category_bp.route('/stats', methods=['GET'])
def category_statistics():
    """Get statistics about categories and their task distribution"""
    categories = Category.query.all()
    stats = {
        'total_categories': len(categories),
        'category_breakdown': []
    }
    
    for category in categories:
        tasks = Task.query.filter_by(category_id=category.id).all()
        completed_tasks = len([t for t in tasks if t.status == 'Completed'])
        pending_tasks = len([t for t in tasks if t.status == 'Pending'])
        
        stats['category_breakdown'].append({
            'id': category.id,
            'name': category.name,
            'total_tasks': len(tasks),
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'completion_rate': round((completed_tasks / len(tasks) * 100) if len(tasks) > 0 else 0, 1)
        })
    
    # Add uncategorized tasks
    uncategorized_tasks = Task.query.filter_by(category_id=None).all()
    completed_uncategorized = len([t for t in uncategorized_tasks if t.status == 'Completed'])
    pending_uncategorized = len([t for t in uncategorized_tasks if t.status == 'Pending'])
    
    stats['uncategorized_tasks'] = {
        'total_tasks': len(uncategorized_tasks),
        'completed_tasks': completed_uncategorized,
        'pending_tasks': pending_uncategorized,
        'completion_rate': round((completed_uncategorized / len(uncategorized_tasks) * 100) if len(uncategorized_tasks) > 0 else 0, 1)
    }
    
    return jsonify(stats), 200
