<?php
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    // Allow GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    // Get query parameters
    $category = $_GET['category'] ?? '';
    $storeId = $_GET['store_id'] ?? '';
    $isActive = $_GET['is_active'] ?? 'true';

    // Get database connection
    $pdo = getDatabaseConnection();

    // Build query
    $query = "SELECT p.id, p.name, p.description, p.price, p.store_id, p.category, p.is_active, p.created_at,
                     s.name as store_name 
              FROM products p 
              LEFT JOIN stores s ON p.store_id = s.id 
              WHERE 1=1";
    $params = [];

    if (!empty($category)) {
        $query .= " AND p.category = ?";
        $params[] = $category;
    }

    if (!empty($storeId)) {
        $query .= " AND p.store_id = ?";
        $params[] = $storeId;
    }

    if ($isActive === 'true') {
        $query .= " AND p.is_active = true";
    }

    $query .= " ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Return products
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>