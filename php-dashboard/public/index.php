<?php
/**
 * البيت السوداني - PHP Web Dashboard
 * Entry point for the web dashboard
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/bootstrap.php';

use App\Controllers\DashboardController;
use App\Controllers\UserController;
use App\Controllers\StoreController;
use App\Controllers\ProductController;
use App\Controllers\AuthController;
use App\Services\Router;

// Start session
session_start();

// Initialize router
$router = new Router();

// Authentication routes
$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->post('/logout', [AuthController::class, 'logout']);

// Dashboard routes (require authentication)
$router->get('/', [DashboardController::class, 'index']);
$router->get('/dashboard', [DashboardController::class, 'index']);

// User management routes
$router->get('/users', [UserController::class, 'index']);
$router->get('/users/create', [UserController::class, 'create']);
$router->post('/users', [UserController::class, 'store']);
$router->get('/users/{id}', [UserController::class, 'show']);
$router->get('/users/{id}/edit', [UserController::class, 'edit']);
$router->put('/users/{id}', [UserController::class, 'update']);
$router->delete('/users/{id}', [UserController::class, 'destroy']);

// Store management routes
$router->get('/stores', [StoreController::class, 'index']);
$router->get('/stores/create', [StoreController::class, 'create']);
$router->post('/stores', [StoreController::class, 'store']);
$router->get('/stores/{id}', [StoreController::class, 'show']);
$router->get('/stores/{id}/edit', [StoreController::class, 'edit']);
$router->put('/stores/{id}', [StoreController::class, 'update']);
$router->delete('/stores/{id}', [StoreController::class, 'destroy']);

// Product management routes
$router->get('/products', [ProductController::class, 'index']);
$router->get('/products/create', [ProductController::class, 'create']);
$router->post('/products', [ProductController::class, 'store']);
$router->get('/products/{id}', [ProductController::class, 'show']);
$router->get('/products/{id}/edit', [ProductController::class, 'edit']);
$router->put('/products/{id}', [ProductController::class, 'update']);
$router->delete('/products/{id}', [ProductController::class, 'destroy']);

// API proxy routes (for mobile app integration)
$router->get('/api/sync', [DashboardController::class, 'syncData']);
$router->post('/api/webhook', [DashboardController::class, 'handleWebhook']);

// Handle the request
try {
    $router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
} catch (Exception $e) {
    // Handle 404 and other errors
    http_response_code(404);
    require_once __DIR__ . '/../src/Views/errors/404.php';
}
?>