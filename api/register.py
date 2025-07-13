from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import pymysql
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/register', methods=['POST'])
def register():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.get_json()
    required_fields = ['username', 'password', 'email', 'fullName']
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if username or email already exists
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", 
                      (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "Username or email already exists"}), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Insert new user
        cursor.execute("""
            INSERT INTO users (username, password, email, fullName, phone, role, isActive, createdAt)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
        """, (
            data['username'],
            hashed_password.decode('utf-8'),
            data['email'],
            data['fullName'],
            data.get('phone', ''),
            data.get('role', 'customer'),
            True
        ))
        
        connection.commit()
        
        return jsonify({
            "status": "success",
            "message": "User registered successfully",
            "user_id": cursor.lastrowid
        })
        
    except Exception as e:
        connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5002)