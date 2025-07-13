from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/products', methods=['GET'])
def get_products():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
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
            SELECT p.*, s.name as storeName, s.category as storeCategory
            FROM products p
            LEFT JOIN stores s ON p.storeId = s.id
            WHERE 1=1
        """
        params = []
        
        if category:
            query += " AND p.category = %s"
            params.append(category)
        
        if store_id:
            query += " AND p.storeId = %s"
            params.append(store_id)
        
        if active_only:
            query += " AND p.isActive = 1"
        
        query += " ORDER BY p.createdAt DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        cursor.execute(query, params)
        products = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "message": "Products retrieved successfully",
            "data": products,
            "count": len(products)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5007)