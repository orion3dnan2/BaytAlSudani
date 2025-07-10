<?php
/**
 * API تسجيل الدخول
 * يستقبل البريد الإلكتروني وكلمة المرور ويتحقق من صحة البيانات
 */

require_once '../config/db.php';

// تعيين رؤوس CORS للسماح بالطلبات من مصادر مختلفة
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// التعامل مع طلبات OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// التأكد من أن الطلب POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'يُسمح فقط بطلبات POST', null, 405);
}

// قراءة البيانات المرسلة بصيغة JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// التحقق من وجود البيانات المطلوبة
if (!$data || !isset($data['email']) || !isset($data['password'])) {
    json_response(false, 'البريد الإلكتروني وكلمة المرور مطلوبان', null, 400);
}

$email = sanitize_input($data['email']);
$password = $data['password'];

// التحقق من صحة البريد الإلكتروني
if (!validate_email($email)) {
    json_response(false, 'البريد الإلكتروني غير صحيح', null, 400);
}

// التحقق من وجود المستخدم في قاعدة البيانات
$query = "SELECT id, name, email, password, role, is_active, created_at FROM users WHERE email = ? AND is_active = 1";
$stmt = $connection->prepare($query);

if (!$stmt) {
    json_response(false, 'خطأ في إعداد الاستعلام', null, 500);
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    json_response(false, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', null, 401);
}

$user = $result->fetch_assoc();

// التحقق من كلمة المرور
if (!password_verify($password, $user['password'])) {
    json_response(false, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', null, 401);
}

// إنشاء توكن بسيط (يمكن تطويره لاستخدام JWT)
$token = base64_encode($user['id'] . ':' . time() . ':' . uniqid());

// تحديث وقت آخر تسجيل دخول
$update_query = "UPDATE users SET last_login = NOW() WHERE id = ?";
$update_stmt = $connection->prepare($update_query);
$update_stmt->bind_param("i", $user['id']);
$update_stmt->execute();

// إرجاع بيانات المستخدم (بدون كلمة المرور)
unset($user['password']);
$user['token'] = $token;
$user['login_time'] = date('Y-m-d H:i:s');

json_response(true, 'تم تسجيل الدخول بنجاح', $user);
?>