<?php
/**
 * API تسجيل مستخدم جديد
 * يستقبل بيانات المستخدم وينشئ حساباً جديداً
 */

require_once '../config/db.php';

// تعيين رؤوس CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// التعامل مع طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// التأكد من أن الطلب POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'يُسمح فقط بطلبات POST', null, 405);
}

// قراءة البيانات المرسلة
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// التحقق من البيانات المطلوبة
$required_fields = ['name', 'email', 'password'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        json_response(false, "الحقل '$field' مطلوب", null, 400);
    }
}

$name = sanitize_input($data['name']);
$email = sanitize_input($data['email']);
$password = $data['password'];
$role = isset($data['role']) ? sanitize_input($data['role']) : 'customer';
$phone = isset($data['phone']) ? sanitize_input($data['phone']) : null;

// التحقق من صحة البيانات
if (!validate_email($email)) {
    json_response(false, 'البريد الإلكتروني غير صحيح', null, 400);
}

if (strlen($password) < 6) {
    json_response(false, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', null, 400);
}

if (strlen($name) < 2) {
    json_response(false, 'الاسم يجب أن يكون حرفين على الأقل', null, 400);
}

// التحقق من عدم وجود البريد الإلكتروني مسبقاً
$check_query = "SELECT id FROM users WHERE email = ?";
$check_stmt = $connection->prepare($check_query);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$existing_user = $check_stmt->get_result();

if ($existing_user->num_rows > 0) {
    json_response(false, 'البريد الإلكتروني مُستخدم بالفعل', null, 409);
}

// تشفير كلمة المرور
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// إدراج المستخدم الجديد
$insert_query = "INSERT INTO users (name, email, password, role, phone, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, NOW())";
$insert_stmt = $connection->prepare($insert_query);

if (!$insert_stmt) {
    json_response(false, 'خطأ في إعداد الاستعلام', null, 500);
}

$insert_stmt->bind_param("sssss", $name, $email, $hashed_password, $role, $phone);

if ($insert_stmt->execute()) {
    $user_id = $connection->insert_id;
    
    // إرجاع بيانات المستخدم الجديد
    $user_data = [
        'id' => $user_id,
        'name' => $name,
        'email' => $email,
        'role' => $role,
        'phone' => $phone,
        'is_active' => true,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    json_response(true, 'تم تسجيل المستخدم بنجاح', $user_data, 201);
} else {
    json_response(false, 'فشل في تسجيل المستخدم', null, 500);
}
?>