<?php
/**
 * API إدارة المتاجر
 * يدعم عرض وإنشاء وتحديث المتاجر
 */

require_once '../config/db.php';

// تعيين رؤوس CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// التعامل مع طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// التحقق من التوكن للعمليات المحمية
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $auth_header = $headers['Authorization'];
        if (strpos($auth_header, 'Bearer ') === 0) {
            $token = substr($auth_header, 7);
        }
    }
    
    if (!$token || !verify_token($token)) {
        json_response(false, 'توكن الوصول مطلوب أو غير صحيح', null, 401);
    }
}

switch ($method) {
    case 'GET':
        handleGetStores();
        break;
    case 'POST':
        handleCreateStore();
        break;
    case 'PUT':
        handleUpdateStore();
        break;
    case 'DELETE':
        handleDeleteStore();
        break;
    default:
        json_response(false, 'طريقة غير مدعومة', null, 405);
}

/**
 * جلب قائمة المتاجر
 */
function handleGetStores() {
    global $connection;
    
    // معاملات الاستعلام
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(50, intval($_GET['limit']))) : 10;
    $search = isset($_GET['search']) ? sanitize_input($_GET['search']) : '';
    $category = isset($_GET['category']) ? sanitize_input($_GET['category']) : '';
    $owner_id = isset($_GET['owner_id']) ? intval($_GET['owner_id']) : null;
    
    $offset = ($page - 1) * $limit;
    
    // بناء الاستعلام
    $base_query = "FROM stores s LEFT JOIN users u ON s.owner_id = u.id WHERE s.is_active = 1";
    $params = [];
    $types = "";
    
    if (!empty($search)) {
        $base_query .= " AND (s.name LIKE ? OR s.description LIKE ?)";
        $search_term = '%' . $search . '%';
        $params[] = $search_term;
        $params[] = $search_term;
        $types .= "ss";
    }
    
    if (!empty($category)) {
        $base_query .= " AND s.category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    if ($owner_id) {
        $base_query .= " AND s.owner_id = ?";
        $params[] = $owner_id;
        $types .= "i";
    }
    
    // حساب العدد الإجمالي
    $count_query = "SELECT COUNT(*) as total " . $base_query;
    $count_stmt = $connection->prepare($count_query);
    
    if (!empty($params)) {
        $count_stmt->bind_param($types, ...$params);
    }
    
    $count_stmt->execute();
    $total_count = $count_stmt->get_result()->fetch_assoc()['total'];
    
    // جلب البيانات
    $data_query = "SELECT s.*, u.name as owner_name " . $base_query . " ORDER BY s.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";
    
    $data_stmt = $connection->prepare($data_query);
    $data_stmt->bind_param($types, ...$params);
    $data_stmt->execute();
    $result = $data_stmt->get_result();
    
    $stores = [];
    while ($row = $result->fetch_assoc()) {
        $stores[] = $row;
    }
    
    $pagination = [
        'current_page' => $page,
        'per_page' => $limit,
        'total' => intval($total_count),
        'total_pages' => ceil($total_count / $limit),
        'has_next' => $page < ceil($total_count / $limit),
        'has_prev' => $page > 1
    ];
    
    json_response(true, 'تم جلب قائمة المتاجر بنجاح', [
        'stores' => $stores,
        'pagination' => $pagination
    ]);
}

/**
 * إنشاء متجر جديد
 */
function handleCreateStore() {
    global $connection;
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // التحقق من البيانات المطلوبة
    $required_fields = ['name', 'description', 'owner_id', 'category'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            json_response(false, "الحقل '$field' مطلوب", null, 400);
        }
    }
    
    $name = sanitize_input($data['name']);
    $description = sanitize_input($data['description']);
    $owner_id = intval($data['owner_id']);
    $category = sanitize_input($data['category']);
    $address = isset($data['address']) ? sanitize_input($data['address']) : null;
    $phone = isset($data['phone']) ? sanitize_input($data['phone']) : null;
    
    // التحقق من وجود المالك
    $owner_check = $connection->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1");
    $owner_check->bind_param("i", $owner_id);
    $owner_check->execute();
    
    if ($owner_check->get_result()->num_rows === 0) {
        json_response(false, 'مالك المتجر غير موجود', null, 400);
    }
    
    // إدراج المتجر الجديد
    $insert_query = "INSERT INTO stores (name, description, owner_id, category, address, phone, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())";
    $insert_stmt = $connection->prepare($insert_query);
    $insert_stmt->bind_param("ssisss", $name, $description, $owner_id, $category, $address, $phone);
    
    if ($insert_stmt->execute()) {
        $store_id = $connection->insert_id;
        
        // جلب بيانات المتجر الجديد
        $select_query = "SELECT s.*, u.name as owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id WHERE s.id = ?";
        $select_stmt = $connection->prepare($select_query);
        $select_stmt->bind_param("i", $store_id);
        $select_stmt->execute();
        $store_data = $select_stmt->get_result()->fetch_assoc();
        
        json_response(true, 'تم إنشاء المتجر بنجاح', $store_data, 201);
    } else {
        json_response(false, 'فشل في إنشاء المتجر', null, 500);
    }
}

/**
 * تحديث متجر موجود
 */
function handleUpdateStore() {
    global $connection;
    
    $store_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$store_id) {
        json_response(false, 'معرف المتجر مطلوب', null, 400);
    }
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        json_response(false, 'بيانات غير صحيحة', null, 400);
    }
    
    // التحقق من وجود المتجر
    $check_query = "SELECT id, owner_id FROM stores WHERE id = ? AND is_active = 1";
    $check_stmt = $connection->prepare($check_query);
    $check_stmt->bind_param("i", $store_id);
    $check_stmt->execute();
    $existing_store = $check_stmt->get_result()->fetch_assoc();
    
    if (!$existing_store) {
        json_response(false, 'المتجر غير موجود', null, 404);
    }
    
    // بناء استعلام التحديث
    $update_fields = [];
    $params = [];
    $types = "";
    
    $allowed_fields = ['name', 'description', 'category', 'address', 'phone'];
    foreach ($allowed_fields as $field) {
        if (isset($data[$field])) {
            $update_fields[] = "$field = ?";
            $params[] = sanitize_input($data[$field]);
            $types .= "s";
        }
    }
    
    if (empty($update_fields)) {
        json_response(false, 'لا توجد بيانات للتحديث', null, 400);
    }
    
    $update_query = "UPDATE stores SET " . implode(', ', $update_fields) . " WHERE id = ?";
    $params[] = $store_id;
    $types .= "i";
    
    $update_stmt = $connection->prepare($update_query);
    $update_stmt->bind_param($types, ...$params);
    
    if ($update_stmt->execute()) {
        // جلب البيانات المحدثة
        $select_query = "SELECT s.*, u.name as owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id WHERE s.id = ?";
        $select_stmt = $connection->prepare($select_query);
        $select_stmt->bind_param("i", $store_id);
        $select_stmt->execute();
        $updated_store = $select_stmt->get_result()->fetch_assoc();
        
        json_response(true, 'تم تحديث المتجر بنجاح', $updated_store);
    } else {
        json_response(false, 'فشل في تحديث المتجر', null, 500);
    }
}

/**
 * حذف متجر (إلغاء تفعيل)
 */
function handleDeleteStore() {
    global $connection;
    
    $store_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$store_id) {
        json_response(false, 'معرف المتجر مطلوب', null, 400);
    }
    
    // التحقق من وجود المتجر
    $check_query = "SELECT id FROM stores WHERE id = ? AND is_active = 1";
    $check_stmt = $connection->prepare($check_query);
    $check_stmt->bind_param("i", $store_id);
    $check_stmt->execute();
    
    if ($check_stmt->get_result()->num_rows === 0) {
        json_response(false, 'المتجر غير موجود', null, 404);
    }
    
    // إلغاء تفعيل المتجر بدلاً من حذفه نهائياً
    $delete_query = "UPDATE stores SET is_active = 0 WHERE id = ?";
    $delete_stmt = $connection->prepare($delete_query);
    $delete_stmt->bind_param("i", $store_id);
    
    if ($delete_stmt->execute()) {
        json_response(true, 'تم حذف المتجر بنجاح');
    } else {
        json_response(false, 'فشل في حذف المتجر', null, 500);
    }
}
?>