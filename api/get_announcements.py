from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get query parameters
        store_id = request.args.get('storeId')
        active_only = request.args.get('active', 'true').lower() == 'true'
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = """
            SELECT a.*, s.name as storeName, s.category as storeCategory
            FROM announcements a
            LEFT JOIN stores s ON a.storeId = s.id
            WHERE 1=1
        """
        params = []
        
        if store_id:
            query += " AND a.storeId = %s"
            params.append(store_id)
        
        if active_only:
            query += " AND a.isActive = 1"
        
        query += " ORDER BY a.createdAt DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        cursor.execute(query, params)
        announcements = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "message": "Announcements retrieved successfully",
            "data": announcements,
            "count": len(announcements)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5014)