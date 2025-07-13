# Bayt AlSudani API

## Overview
This is a comprehensive RESTful API for the Bayt AlSudani (Sudanese Marketplace) platform built with Python Flask and MySQL.

## Features
- User Authentication (Login/Register)
- Store Management
- Product Management
- Service Management
- Job Listings
- Announcements
- JWT Token Authentication
- API Token Security
- CORS Support

## Installation

1. Install Python dependencies:
```bash
pip install flask flask-cors pymysql python-dotenv sqlalchemy bcrypt pyjwt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Configure your MySQL database:
```sql
CREATE DATABASE sudanese_marketplace;
```

## Environment Variables

Required environment variables in `.env`:

```
DB_HOST=localhost
DB_NAME=sudanese_marketplace
DB_USER=root
DB_PASS=your_password
API_TOKEN=your-secret-api-token
JWT_SECRET=your-jwt-secret-key
API_PORT=5000
DEBUG=true
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/<id>` - Get store by ID
- `POST /api/stores` - Create new store

### Products
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product by ID
- `POST /api/products` - Create new product

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create new announcement

## Security

All API endpoints require authentication via API token:
```
Authorization: Bearer your-secret-api-token
```

## Running Individual Endpoints

Each endpoint can be run independently:

```bash
# Login service
python api/login.py

# Register service
python api/register.py

# Store services
python api/create_store.py
python api/get_stores.py
python api/get_store_by_id.py

# Product services
python api/create_product.py
python api/get_products.py
python api/get_product_by_id.py

# Service management
python api/create_service.py
python api/get_services.py

# Job management
python api/create_job.py
python api/get_jobs.py

# Announcement management
python api/create_announcement.py
python api/get_announcements.py
```

## Running Main Server

To run all endpoints from a single server:

```bash
python api/main_server.py
```

## Testing

Run the test suite:

```bash
python api/test_api.py
```

## Database Schema

The API expects the following MySQL tables:

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'merchant', 'customer') DEFAULT 'customer',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ownerId INT NOT NULL,
    category VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);
```

### Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    storeId INT NOT NULL,
    category VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
);
```

### Services Table
```sql
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    storeId INT NOT NULL,
    category VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary DECIMAL(10,2),
    location VARCHAR(255),
    storeId INT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
);
```

### Announcements Table
```sql
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    storeId INT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
);
```

## Response Format

All API responses follow this format:

```json
{
  "status": "success|error",
  "message": "Description of the result",
  "data": {}, // Optional data payload
  "count": 0  // Optional count for list endpoints
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing API token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include authentication checks
4. Test all endpoints before deployment
5. Update documentation for new endpoints