from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/stores', methods=['POST'])
def create_store():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.get_json()
    required_fields = ['name', 'description', 'ownerId', 'category']
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if owner exists
        cursor.execute("SELECT id FROM users WHERE id = %s", (data['ownerId'],))
        if not cursor.fetchone():
            return jsonify({"status": "error", "message": "Owner not found"}), 404
        
        # Insert new store
        cursor.execute("""
            INSERT INTO stores (name, description, ownerId, category, address, phone, isActive, createdAt)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
        """, (
            data['name'],
            data['description'],
            data['ownerId'],
            data['category'],
            data.get('address', ''),
            data.get('phone', ''),
            True
        ))
        
        connection.commit()
        store_id = cursor.lastrowid
        
        return jsonify({
            "status": "success",
            "message": "Store created successfully",
            "store_id": store_id
        })
        
    except Exception as e:
        connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5003)