from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"status": "error", "message": "Username and password required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (data['username'],))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            # Generate JWT token
            payload = {
                'user_id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            token = jwt.encode(payload, os.getenv('JWT_SECRET', 'your-secret-key'), algorithm='HS256')
            
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "role": user['role'],
                    "fullName": user['fullName']
                }
            })
        else:
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5001)