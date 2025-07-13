from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection
from auth_utils import require_jwt_auth

app = Flask(__name__)
CORS(app)

@app.route('/api/services', methods=['GET'])
def get_services():
    # JWT authentication check
    payload, error_response = require_jwt_auth(request)
    if error_response:
        return error_response
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get query parameters
        category = request.args.get('category')
        store_id = request.args.get('storeId')
        active_only = request.args.get('active', 'true').lower() == 'true'
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = """
            SELECT s.*, st.name as storeName, st.category as storeCategory
            FROM services s
            LEFT JOIN stores st ON s.storeId = st.id
            WHERE 1=1
        """
        params = []
        
        if category:
            query += " AND s.category = %s"
            params.append(category)
        
        if store_id:
            query += " AND s.storeId = %s"
            params.append(store_id)
        
        if active_only:
            query += " AND s.isActive = 1"
        
        query += " ORDER BY s.createdAt DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        cursor.execute(query, params)
        services = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "message": "Services retrieved successfully",
            "data": services,
            "count": len(services)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5010)