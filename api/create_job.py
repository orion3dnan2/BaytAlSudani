from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection
from auth_utils import require_jwt_auth

app = Flask(__name__)
CORS(app)

@app.route('/api/jobs', methods=['POST'])
def create_job():
    # JWT authentication check
    payload, error_response = require_jwt_auth(request)
    if error_response:
        return error_response
    
    data = request.get_json()
    required_fields = ['title', 'description', 'storeId']
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if store exists
        cursor.execute("SELECT id FROM stores WHERE id = %s", (data['storeId'],))
        if not cursor.fetchone():
            return jsonify({"status": "error", "message": "Store not found"}), 404
        
        # Validate salary if provided
        salary = None
        if 'salary' in data and data['salary']:
            try:
                salary = float(data['salary'])
                if salary < 0:
                    return jsonify({"status": "error", "message": "Salary must be positive"}), 400
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid salary format"}), 400
        
        # Insert new job
        cursor.execute("""
            INSERT INTO jobs (title, description, salary, location, storeId, isActive, createdAt)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (
            data['title'],
            data['description'],
            salary,
            data.get('location', ''),
            data['storeId'],
            True
        ))
        
        connection.commit()
        job_id = cursor.lastrowid
        
        return jsonify({
            "status": "success",
            "message": "Job created successfully",
            "job_id": job_id
        })
        
    except Exception as e:
        connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5011)