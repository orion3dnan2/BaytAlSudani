from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get query parameters
        store_id = request.args.get('storeId')
        location = request.args.get('location')
        active_only = request.args.get('active', 'true').lower() == 'true'
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = """
            SELECT j.*, s.name as storeName, s.category as storeCategory
            FROM jobs j
            LEFT JOIN stores s ON j.storeId = s.id
            WHERE 1=1
        """
        params = []
        
        if store_id:
            query += " AND j.storeId = %s"
            params.append(store_id)
        
        if location:
            query += " AND j.location LIKE %s"
            params.append(f"%{location}%")
        
        if active_only:
            query += " AND j.isActive = 1"
        
        query += " ORDER BY j.createdAt DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        cursor.execute(query, params)
        jobs = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "message": "Jobs retrieved successfully",
            "data": jobs,
            "count": len(jobs)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5012)