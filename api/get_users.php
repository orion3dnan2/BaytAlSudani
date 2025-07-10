<?php
/**
 * API للحصول على قائمة المستخدمين
 * يتطلب توكن صحيح للوصول
 */

require_once '../config/db.php';

// تعيين رؤوس CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// التعامل مع طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// التأكد من أن الطلب GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(false, 'يُسمح فقط بطلبات GET', null, 405);
}

// التحقق من وجود التوكن
$headers = getallheaders();
$token = null;

if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    if (strpos($auth_header, 'Bearer ') === 0) {
        $token = substr($auth_header, 7);
    }
} elseif (isset($_GET['token'])) {
    $token = $_GET['token'];
}

if (!$token || !verify_token($token)) {
    json_response(false, 'توكن الوصول مطلوب أو غير صحيح', null, 401);
}

// معاملات الاستعلام الاختيارية
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
$search = isset($_GET['search']) ? sanitize_input($_GET['search']) : '';
$role = isset($_GET['role']) ? sanitize_input($_GET['role']) : '';

$offset = ($page - 1) * $limit;

// بناء الاستعلام الأساسي
$base_query = "FROM users WHERE 1=1";
$params = [];
$types = "";

// إضافة شروط البحث
if (!empty($search)) {
    $base_query .= " AND (name LIKE ? OR email LIKE ?)";
    $search_term = '%' . $search . '%';
    $params[] = $search_term;
    $params[] = $search_term;
    $types .= "ss";
}

if (!empty($role)) {
    $base_query .= " AND role = ?";
    $params[] = $role;
    $types .= "s";
}

// حساب العدد الإجمالي
$count_query = "SELECT COUNT(*) as total " . $base_query;
$count_stmt = $connection->prepare($count_query);

if (!empty($params)) {
    $count_stmt->bind_param($types, ...$params);
}

$count_stmt->execute();
$total_result = $count_stmt->get_result();
$total_count = $total_result->fetch_assoc()['total'];

// الحصول على البيانات مع التصفح
$data_query = "SELECT id, name, email, role, is_active, created_at, last_login " . $base_query . " ORDER BY created_at DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

$data_stmt = $connection->prepare($data_query);
$data_stmt->bind_param($types, ...$params);
$data_stmt->execute();
$result = $data_stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// معلومات التصفح
$pagination = [
    'current_page' => $page,
    'per_page' => $limit,
    'total' => intval($total_count),
    'total_pages' => ceil($total_count / $limit),
    'has_next' => $page < ceil($total_count / $limit),
    'has_prev' => $page > 1
];

$response_data = [
    'users' => $users,
    'pagination' => $pagination
];

json_response(true, 'تم جلب قائمة المستخدمين بنجاح', $response_data);
?>