# البيت السوداني - PHP Web Dashboard

## Overview
Web-based administration dashboard for البيت السوداني (Sudanese Marketplace) built with PHP, designed to work alongside the React Native mobile app through a unified REST API.

## Features
- 🔐 Admin authentication and user management
- 📊 Analytics and reporting dashboard
- 🏪 Store management and approval system
- 📦 Product catalog management
- 👥 User account management
- 🛠️ System settings and configuration
- 📱 Mobile app data synchronization
- 🇸🇩 Arabic RTL support
- 📈 Sales and performance metrics

## Technology Stack
- **PHP 8.1+**: Server-side scripting
- **MySQL/PostgreSQL**: Database management
- **Bootstrap 5**: UI framework with RTL support
- **jQuery**: JavaScript interactions
- **Chart.js**: Analytics visualization
- **REST API**: Data synchronization with mobile app

## Getting Started

### Prerequisites
- PHP 8.1 or higher
- MySQL 8.0 or PostgreSQL 14+
- Apache/Nginx web server
- Composer for dependency management

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd php-dashboard
```

2. Install PHP dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database and API settings
```

4. Set up the database:
```bash
php artisan migrate
php artisan db:seed
```

5. Start the development server:
```bash
php -S localhost:8000
```

## Project Structure
```
php-dashboard/
├── public/
│   ├── index.php                 # Entry point
│   ├── assets/                   # CSS, JS, images
│   └── uploads/                  # User uploads
├── src/
│   ├── Controllers/              # Page controllers
│   ├── Models/                   # Data models
│   ├── Services/                 # Business logic
│   ├── Utils/                    # Helper functions
│   └── Views/                    # HTML templates
├── config/
│   ├── database.php              # Database configuration
│   ├── api.php                   # API settings
│   └── app.php                   # Application settings
└── composer.json                 # Dependencies
```

## API Integration

### Unified REST API Endpoints
The dashboard communicates with the same REST API used by the mobile app:

#### Authentication
- `POST /api/auth/login` - Admin/user login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

#### User Management
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Store Management
- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get specific store
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

#### Product Management
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/store/:storeId` - Get products by store
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Services & Jobs
- `GET /api/services` - List all services
- `GET /api/jobs` - List all jobs
- `GET /api/announcements` - List all announcements

### API Configuration
```php
// config/api.php
return [
    'base_url' => 'https://your-backend-url.com/api',
    'timeout' => 30,
    'headers' => [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ],
];
```

## Features

### Admin Dashboard
- **Overview**: Key metrics and statistics
- **Recent Activity**: Latest user actions and system events
- **Quick Actions**: Common administrative tasks
- **System Status**: API health and performance metrics

### User Management
- **User List**: Paginated user directory
- **User Details**: Individual user profiles and activity
- **Role Management**: Admin, merchant, customer roles
- **Account Actions**: Enable/disable, password reset

### Store Management
- **Store Directory**: All registered stores
- **Store Approval**: Review and approve new stores
- **Store Analytics**: Performance metrics per store
- **Store Settings**: Configuration and policies

### Product Management
- **Product Catalog**: Complete product inventory
- **Category Management**: Product categorization
- **Bulk Operations**: Mass product updates
- **Product Analytics**: Sales and view statistics

### Analytics & Reporting
- **Sales Reports**: Revenue and transaction analytics
- **User Analytics**: Registration and engagement metrics
- **Store Performance**: Store-specific analytics
- **System Reports**: Technical performance metrics

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'merchant', 'customer') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### Products Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    store_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);
```

## Security Features

### Authentication
- **Session Management**: Secure PHP sessions
- **Password Hashing**: bcrypt with salt
- **CSRF Protection**: Token-based form protection
- **Input Validation**: Comprehensive data sanitization

### Authorization
- **Role-based Access**: Admin, merchant, customer roles
- **Permission System**: Granular access control
- **API Authentication**: JWT token validation
- **Rate Limiting**: API request throttling

### Data Protection
- **SQL Injection Prevention**: Prepared statements
- **XSS Protection**: Input sanitization and output encoding
- **File Upload Security**: Type and size validation
- **Data Encryption**: Sensitive data protection

## Styling & Theme

### RTL Support
- **Bootstrap RTL**: Right-to-left layout support
- **Arabic Typography**: Proper font rendering
- **Cultural Colors**: Sudanese theme (Blue, Red, Gold, Sand)
- **Responsive Design**: Mobile-first approach

### Color Scheme
```css
:root {
    --primary-color: #1B4F72;    /* Deep Blue */
    --secondary-color: #E74C3C;  /* Red */
    --accent-color: #F1C40F;     /* Gold */
    --background-color: #F8F9FA; /* Light Gray */
    --text-color: #2C3E50;       /* Dark Gray */
}
```

## Development

### Adding New Features
1. Create controller in `src/Controllers/`
2. Add routes in `public/index.php`
3. Create view templates in `src/Views/`
4. Update navigation if needed

### API Integration
1. Use the `ApiClient` class for all API calls
2. Handle errors gracefully with user feedback
3. Implement caching for frequently accessed data
4. Add loading states for better UX

### Testing
```bash
# Run PHP unit tests
composer test

# Run integration tests
composer test:integration

# Check code style
composer lint
```

## Deployment

### Production Setup
1. Configure web server (Apache/Nginx)
2. Set up SSL certificates
3. Configure database connections
4. Set environment variables
5. Enable caching and optimization

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_NAME=bait_sudani
DB_USER=username
DB_PASS=password

# API
API_BASE_URL=https://api.bait-sudani.com
API_KEY=your-api-key

# Security
JWT_SECRET=your-jwt-secret
SESSION_KEY=your-session-key
```

## Monitoring & Maintenance

### Logging
- **Error Logs**: PHP error logging
- **Access Logs**: Web server access logs
- **API Logs**: API request/response logging
- **Security Logs**: Authentication and authorization events

### Performance
- **Caching**: Redis/Memcached for data caching
- **Database Optimization**: Query optimization and indexing
- **CDN**: Static asset delivery
- **Monitoring**: Server and application monitoring

## Support

For technical support:
1. Check the troubleshooting guide
2. Review PHP and framework documentation
3. Check API documentation
4. Submit support tickets

## License
This project is proprietary software for البيت السوداني marketplace.