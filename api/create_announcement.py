from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    data = request.get_json()
    required_fields = ['title', 'content', 'storeId']
    
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
        
        # Insert new announcement
        cursor.execute("""
            INSERT INTO announcements (title, content, storeId, isActive, createdAt)
            VALUES (%s, %s, %s, %s, NOW())
        """, (
            data['title'],
            data['content'],
            data['storeId'],
            True
        ))
        
        connection.commit()
        announcement_id = cursor.lastrowid
        
        return jsonify({
            "status": "success",
            "message": "Announcement created successfully",
            "announcement_id": announcement_id
        })
        
    except Exception as e:
        connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5013)