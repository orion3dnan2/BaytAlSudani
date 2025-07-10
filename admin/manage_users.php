<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_id'])) {
    header('Location: login_admin.php');
    exit;
}

// Include database connection
require_once '../api/config/database.php';

$users = [];
$error = '';
$success = '';

// Handle form submissions
if ($_POST) {
    try {
        $pdo = new PDO($dsn, $db_user, $db_password, $options);
        
        if (isset($_POST['action'])) {
            switch ($_POST['action']) {
                case 'deactivate':
                    $userId = (int)$_POST['user_id'];
                    $stmt = $pdo->prepare("UPDATE legacy_users SET is_active = false WHERE id = ?");
                    $stmt->execute([$userId]);
                    $success = 'تم إلغاء تفعيل المستخدم بنجاح';
                    break;
                    
                case 'activate':
                    $userId = (int)$_POST['user_id'];
                    $stmt = $pdo->prepare("UPDATE legacy_users SET is_active = true WHERE id = ?");
                    $stmt->execute([$userId]);
                    $success = 'تم تفعيل المستخدم بنجاح';
                    break;
                    
                case 'change_role':
                    $userId = (int)$_POST['user_id'];
                    $newRole = $_POST['new_role'];
                    $stmt = $pdo->prepare("UPDATE legacy_users SET role = ? WHERE id = ?");
                    $stmt->execute([$newRole, $userId]);
                    $success = 'تم تغيير دور المستخدم بنجاح';
                    break;
            }
        }
    } catch (PDOException $e) {
        $error = 'خطأ في الاتصال بقاعدة البيانات';
    }
}

// Get users list
try {
    $pdo = new PDO($dsn, $db_user, $db_password, $options);
    $stmt = $pdo->query("SELECT id, username, email, full_name, role, is_active, created_at FROM legacy_users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = 'خطأ في جلب بيانات المستخدمين';
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة المستخدمين - البيت السوداني</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
        }
        .navbar {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .badge-role {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-radius: 25px;
        }
        .table th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .btn-action {
            border-radius: 20px;
            padding: 5px 15px;
            font-size: 0.8rem;
            margin: 2px;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="dashboard.php">
                <i class="fas fa-home me-2"></i>
                البيت السوداني - لوحة التحكم
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="dashboard.php">
                    <i class="fas fa-chart-line me-1"></i>
                    لوحة المعلومات
                </a>
                <a class="nav-link active" href="manage_users.php">
                    <i class="fas fa-users me-1"></i>
                    إدارة المستخدمين
                </a>
                <a class="nav-link" href="logout.php">
                    <i class="fas fa-sign-out-alt me-1"></i>
                    تسجيل الخروج
                </a>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-4">
                    <i class="fas fa-users me-2"></i>
                    إدارة المستخدمين
                </h1>
            </div>
        </div>

        <!-- Alerts -->
        <?php if ($error): ?>
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>

        <!-- Users Table -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-list me-2"></i>
                    قائمة المستخدمين
                </h5>
            </div>
            <div class="card-body">
                <?php if (empty($users)): ?>
                    <div class="text-center py-4">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <p class="text-muted">لا توجد مستخدمين في النظام</p>
                    </div>
                <?php else: ?>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>اسم المستخدم</th>
                                    <th>الاسم الكامل</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>الدور</th>
                                    <th>الحالة</th>
                                    <th>تاريخ التسجيل</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo htmlspecialchars($user['username']); ?></strong>
                                        </td>
                                        <td><?php echo htmlspecialchars($user['full_name']); ?></td>
                                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                                        <td>
                                            <?php
                                            $roleClass = '';
                                            $roleText = '';
                                            switch ($user['role']) {
                                                case 'admin':
                                                    $roleClass = 'bg-danger';
                                                    $roleText = 'مدير';
                                                    break;
                                                case 'merchant':
                                                    $roleClass = 'bg-warning';
                                                    $roleText = 'تاجر';
                                                    break;
                                                case 'customer':
                                                default:
                                                    $roleClass = 'bg-primary';
                                                    $roleText = 'عميل';
                                                    break;
                                            }
                                            ?>
                                            <span class="badge <?php echo $roleClass; ?> badge-role">
                                                <?php echo $roleText; ?>
                                            </span>
                                        </td>
                                        <td>
                                            <?php if ($user['is_active']): ?>
                                                <span class="badge bg-success">نشط</span>
                                            <?php else: ?>
                                                <span class="badge bg-secondary">غير نشط</span>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <?php echo date('Y-m-d', strtotime($user['created_at'])); ?>
                                        </td>
                                        <td>
                                            <?php if ($user['is_active']): ?>
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="action" value="deactivate">
                                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                    <button type="submit" class="btn btn-sm btn-outline-danger btn-action" 
                                                            onclick="return confirm('هل أنت متأكد من إلغاء تفعيل هذا المستخدم؟')">
                                                        <i class="fas fa-ban"></i> إلغاء التفعيل
                                                    </button>
                                                </form>
                                            <?php else: ?>
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="action" value="activate">
                                                    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                    <button type="submit" class="btn btn-sm btn-outline-success btn-action">
                                                        <i class="fas fa-check"></i> تفعيل
                                                    </button>
                                                </form>
                                            <?php endif; ?>
                                            
                                            <!-- Role Change Dropdown -->
                                            <div class="dropdown d-inline">
                                                <button class="btn btn-sm btn-outline-secondary btn-action dropdown-toggle" 
                                                        type="button" data-bs-toggle="dropdown">
                                                    <i class="fas fa-user-cog"></i> تغيير الدور
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li>
                                                        <form method="POST" class="d-inline">
                                                            <input type="hidden" name="action" value="change_role">
                                                            <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                            <input type="hidden" name="new_role" value="customer">
                                                            <button type="submit" class="dropdown-item">
                                                                <i class="fas fa-user"></i> عميل
                                                            </button>
                                                        </form>
                                                    </li>
                                                    <li>
                                                        <form method="POST" class="d-inline">
                                                            <input type="hidden" name="action" value="change_role">
                                                            <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                            <input type="hidden" name="new_role" value="merchant">
                                                            <button type="submit" class="dropdown-item">
                                                                <i class="fas fa-store"></i> تاجر
                                                            </button>
                                                        </form>
                                                    </li>
                                                    <li>
                                                        <form method="POST" class="d-inline">
                                                            <input type="hidden" name="action" value="change_role">
                                                            <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                                                            <input type="hidden" name="new_role" value="admin">
                                                            <button type="submit" class="dropdown-item">
                                                                <i class="fas fa-shield-alt"></i> مدير
                                                            </button>
                                                        </form>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>