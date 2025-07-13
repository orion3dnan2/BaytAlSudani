<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_id'])) {
    header('Location: login_admin.php');
    exit;
}

// Include database connection
require_once '../api/config/database.php';

// Get basic statistics
$stats = [];
try {
    $pdo = new PDO($dsn, $db_user, $db_password, $options);
    
    // Get counts for dashboard
    $stats['users'] = $pdo->query("SELECT COUNT(*) FROM legacy_users")->fetchColumn();
    $stats['stores'] = $pdo->query("SELECT COUNT(*) FROM stores")->fetchColumn();
    $stats['products'] = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $stats['services'] = $pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
    $stats['jobs'] = $pdo->query("SELECT COUNT(*) FROM jobs")->fetchColumn();
    $stats['announcements'] = $pdo->query("SELECT COUNT(*) FROM announcements")->fetchColumn();
} catch (PDOException $e) {
    // If database connection fails, use default values
    $stats = [
        'users' => 0,
        'stores' => 0,
        'products' => 0,
        'services' => 0,
        'jobs' => 0,
        'announcements' => 0
    ];
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم الإدارية - البيت السوداني</title>
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
        .stat-card {
            transition: transform 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
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
                <a class="nav-link" href="manage_users.php">
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

    <!-- Dashboard Content -->
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-4">
                    <i class="fas fa-chart-line me-2"></i>
                    لوحة المعلومات الرئيسية
                </h1>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row">
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-primary">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['users']; ?></h3>
                    <p class="text-muted mb-0">المستخدمين</p>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-success">
                        <i class="fas fa-store"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['stores']; ?></h3>
                    <p class="text-muted mb-0">المتاجر</p>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-warning">
                        <i class="fas fa-box"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['products']; ?></h3>
                    <p class="text-muted mb-0">المنتجات</p>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-info">
                        <i class="fas fa-cogs"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['services']; ?></h3>
                    <p class="text-muted mb-0">الخدمات</p>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-danger">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['jobs']; ?></h3>
                    <p class="text-muted mb-0">الوظائف</p>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-4">
                <div class="card stat-card text-center p-3">
                    <div class="stat-icon text-secondary">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <h3 class="fw-bold"><?php echo $stats['announcements']; ?></h3>
                    <p class="text-muted mb-0">الإعلانات</p>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-clock me-2"></i>
                            النشاطات الأخيرة
                        </h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">سيتم عرض النشاطات الأخيرة هنا...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>