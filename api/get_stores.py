from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/stores', methods=['GET'])
def get_stores():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get query parameters
        category = request.args.get('category')
        owner_id = request.args.get('ownerId')
        active_only = request.args.get('active', 'true').lower() == 'true'
        
        # Build query
        query = """
            SELECT s.*, u.username as ownerName, u.fullName as ownerFullName
            FROM stores s
            LEFT JOIN users u ON s.ownerId = u.id
            WHERE 1=1
        """
        params = []
        
        if category:
            query += " AND s.category = %s"
            params.append(category)
        
        if owner_id:
            query += " AND s.ownerId = %s"
            params.append(owner_id)
        
        if active_only:
            query += " AND s.isActive = 1"
        
        query += " ORDER BY s.createdAt DESC"
        
        cursor.execute(query, params)
        stores = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "message": "Stores retrieved successfully",
            "data": stores,
            "count": len(stores)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5004)