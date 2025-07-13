<?php

namespace App\Services;

/**
 * API Client for communicating with the Node.js backend
 * Handles all REST API calls to synchronize data between
 * the PHP dashboard and the mobile app backend
 */
class ApiClient
{
    private $baseUrl;
    private $timeout;
    private $headers;
    private $authToken;

    public function __construct()
    {
        $this->baseUrl = $_ENV['API_BASE_URL'] ?? 'https://your-backend-url.com/api';
        $this->timeout = $_ENV['API_TIMEOUT'] ?? 30;
        $this->headers = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];
        $this->authToken = $_SESSION['api_token'] ?? null;
    }

    /**
     * Set authentication token
     */
    public function setAuthToken(string $token): void
    {
        $this->authToken = $token;
        $_SESSION['api_token'] = $token;
    }

    /**
     * Get authentication token
     */
    public function getAuthToken(): ?string
    {
        return $this->authToken;
    }

    /**
     * Make HTTP request to API
     */
    private function makeRequest(string $method, string $endpoint, array $data = null): array
    {
        $url = $this->baseUrl . $endpoint;
        
        $ch = curl_init();
        
        // Basic cURL options
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => $this->getHeaders(),
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false, // For development only
        ]);

        // Set HTTP method and data
        switch (strtoupper($method)) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'PUT':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new \Exception("cURL Error: " . $error);
        }

        $decodedResponse = json_decode($response, true);
        
        if ($httpCode >= 400) {
            throw new \Exception(
                $decodedResponse['error'] ?? "HTTP Error: " . $httpCode,
                $httpCode
            );
        }

        return $decodedResponse ?: [];
    }

    /**
     * Get headers with authentication
     */
    private function getHeaders(): array
    {
        $headers = $this->headers;
        
        if ($this->authToken) {
            $headers[] = 'Authorization: Bearer ' . $this->authToken;
        }
        
        return $headers;
    }

    // Authentication methods
    public function login(string $username, string $password): array
    {
        $response = $this->makeRequest('POST', '/auth/login', [
            'username' => $username,
            'password' => $password,
        ]);
        
        if (isset($response['token'])) {
            $this->setAuthToken($response['token']);
        }
        
        return $response;
    }

    public function register(array $userData): array
    {
        return $this->makeRequest('POST', '/auth/register', $userData);
    }

    public function getCurrentUser(): array
    {
        return $this->makeRequest('GET', '/auth/me');
    }

    // User management methods
    public function getUsers(): array
    {
        return $this->makeRequest('GET', '/users');
    }

    public function getUser(int $id): array
    {
        return $this->makeRequest('GET', "/users/{$id}");
    }

    public function createUser(array $userData): array
    {
        return $this->makeRequest('POST', '/users', $userData);
    }

    public function updateUser(int $id, array $userData): array
    {
        return $this->makeRequest('PUT', "/users/{$id}", $userData);
    }

    public function deleteUser(int $id): array
    {
        return $this->makeRequest('DELETE', "/users/{$id}");
    }

    // Store management methods
    public function getStores(): array
    {
        return $this->makeRequest('GET', '/stores');
    }

    public function getStore(int $id): array
    {
        return $this->makeRequest('GET', "/stores/{$id}");
    }

    public function createStore(array $storeData): array
    {
        return $this->makeRequest('POST', '/stores', $storeData);
    }

    public function updateStore(int $id, array $storeData): array
    {
        return $this->makeRequest('PUT', "/stores/{$id}", $storeData);
    }

    public function deleteStore(int $id): array
    {
        return $this->makeRequest('DELETE', "/stores/{$id}");
    }

    // Product management methods
    public function getProducts(): array
    {
        return $this->makeRequest('GET', '/products');
    }

    public function getProduct(int $id): array
    {
        return $this->makeRequest('GET', "/products/{$id}");
    }

    public function getProductsByStore(int $storeId): array
    {
        return $this->makeRequest('GET', "/products/store/{$storeId}");
    }

    public function createProduct(array $productData): array
    {
        return $this->makeRequest('POST', '/products', $productData);
    }

    public function updateProduct(int $id, array $productData): array
    {
        return $this->makeRequest('PUT', "/products/{$id}", $productData);
    }

    public function deleteProduct(int $id): array
    {
        return $this->makeRequest('DELETE', "/products/{$id}");
    }

    // Service management methods
    public function getServices(): array
    {
        return $this->makeRequest('GET', '/services');
    }

    public function getService(int $id): array
    {
        return $this->makeRequest('GET', "/services/{$id}");
    }

    // Job management methods
    public function getJobs(): array
    {
        return $this->makeRequest('GET', '/jobs');
    }

    public function getJob(int $id): array
    {
        return $this->makeRequest('GET', "/jobs/{$id}");
    }

    // Announcement management methods
    public function getAnnouncements(): array
    {
        return $this->makeRequest('GET', '/announcements');
    }

    public function getAnnouncement(int $id): array
    {
        return $this->makeRequest('GET', "/announcements/{$id}");
    }

    // Utility methods
    public function testConnection(): bool
    {
        try {
            $this->makeRequest('GET', '/health');
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function syncData(): array
    {
        // Sync all data from the API
        return [
            'users' => $this->getUsers(),
            'stores' => $this->getStores(),
            'products' => $this->getProducts(),
            'services' => $this->getServices(),
            'jobs' => $this->getJobs(),
            'announcements' => $this->getAnnouncements(),
        ];
    }
}
?>