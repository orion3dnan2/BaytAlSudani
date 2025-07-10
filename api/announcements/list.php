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

    $storeId = $_GET['store_id'] ?? '';
    $isActive = $_GET['is_active'] ?? 'true';

    $pdo = getDatabaseConnection();

    $query = "SELECT a.id, a.title, a.content, a.store_id, a.is_active, a.created_at,
                     s.name as store_name 
              FROM announcements a 
              LEFT JOIN stores s ON a.store_id = s.id 
              WHERE 1=1";
    $params = [];

    if (!empty($storeId)) {
        $query .= " AND a.store_id = ?";
        $params[] = $storeId;
    }

    if ($isActive === 'true') {
        $query .= " AND a.is_active = true";
    }

    $query .= " ORDER BY a.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $announcements = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $announcements
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>