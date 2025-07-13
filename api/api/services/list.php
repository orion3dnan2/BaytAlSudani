<?php
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    $category = $_GET['category'] ?? '';
    $storeId = $_GET['store_id'] ?? '';
    $isActive = $_GET['is_active'] ?? 'true';

    $pdo = getDatabaseConnection();

    $query = "SELECT s.id, s.name, s.description, s.price, s.store_id, s.category, s.is_active, s.created_at,
                     st.name as store_name 
              FROM services s 
              LEFT JOIN stores st ON s.store_id = st.id 
              WHERE 1=1";
    $params = [];

    if (!empty($category)) {
        $query .= " AND s.category = ?";
        $params[] = $category;
    }

    if (!empty($storeId)) {
        $query .= " AND s.store_id = ?";
        $params[] = $storeId;
    }

    if ($isActive === 'true') {
        $query .= " AND s.is_active = true";
    }

    $query .= " ORDER BY s.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $services = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $services
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>