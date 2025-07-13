# البيت السوداني - Sudanese Marketplace Platform

## Overview

This is a modern Arabic marketplace platform built with React and Express.js, designed to connect Sudanese merchants and service providers with customers. The application features a clean, RTL-optimized interface with sections for marketplace, services, jobs, and announcements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom Arabic/RTL styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Language**: Arabic (RTL) with Google Fonts (Noto Sans Arabic)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Development**: Hot reloading with Vite middleware integration

### Key Components

#### Frontend Structure
```
client/
├── src/
│   ├── components/ui/     # Reusable UI components (30+ Shadcn components)
│   ├── pages/            # Route-based page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and query client
│   └── main.tsx          # Application entry point
```

#### Backend Structure
```
server/
├── index.ts              # Express server setup
├── routes.ts             # API route definitions
├── storage.ts            # Database abstraction layer
└── vite.ts              # Development server integration
```

#### Shared Resources
```
shared/
└── schema.ts             # Database schema and validation
```

### Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express server handles requests through registered routes
3. **Database Operations**: Storage layer abstracts database interactions using Drizzle ORM
4. **Response Handling**: Structured JSON responses with error handling middleware

### Database Schema

Complete marketplace database schema with the following tables:
- **Users Table**: id, username, password, email, fullName, phone, role, isActive, createdAt
- **Stores Table**: id, name, description, ownerId, category, address, phone, isActive, createdAt
- **Products Table**: id, name, description, price, storeId, category, isActive, createdAt
- **Services Table**: id, name, description, price, storeId, category, isActive, createdAt
- **Jobs Table**: id, title, description, salary, location, storeId, isActive, createdAt
- **Announcements Table**: id, title, content, storeId, isActive, createdAt
- **Schema Validation**: Zod integration for type-safe validation
- **ORM**: Drizzle ORM with PostgreSQL dialect and full relations support

### External Dependencies

#### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Arabic typography support

#### Data & State
- **TanStack Query**: Server state management
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Schema validation
- **React Hook Form**: Form management

#### Development Tools
- **Vite**: Fast build tool and dev server
- **ESBuild**: Production bundling
- **TypeScript**: Type safety across the stack

### Deployment Strategy

#### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle Kit handles schema migrations

#### Environment Setup
- **Development**: `npm run dev` - runs TypeScript server with hot reload
- **Production**: `npm run build && npm start` - builds and runs optimized bundle
- **Database**: `npm run db:push` - applies schema changes

#### Key Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Management**: PostgreSQL-backed sessions for scalability
- **Static Assets**: Express serves built React app in production

### Architecture Decisions

#### Database Choice
- **PostgreSQL**: Chosen for reliability and scalability
- **Neon Serverless**: Provides managed PostgreSQL with excellent developer experience
- **Drizzle ORM**: Type-safe alternative to traditional ORMs with better performance

#### UI Framework Selection
- **Shadcn/ui**: Provides high-quality, customizable components
- **Radix UI**: Ensures accessibility compliance
- **Tailwind CSS**: Enables rapid UI development with consistent design

#### RTL Support
- **Arabic First**: HTML lang and dir attributes set for Arabic
- **Custom Styling**: Tailwind configured for RTL layout support
- **Typography**: Google Fonts integration for proper Arabic rendering

#### State Management
- **TanStack Query**: Handles server state, caching, and synchronization
- **Local State**: React hooks for component-level state management
- **Form State**: React Hook Form for efficient form handling

This architecture provides a solid foundation for a marketplace platform with room for growth in features like authentication, product management, and payment processing.

## Recent Changes

### July 13, 2025 - JWT Authentication System Upgrade
- **JWT Implementation**: Completely upgraded authentication system from API tokens to JWT-based authentication
- **Security Enhancement**: Implemented proper JWT token generation and verification using PyJWT with HS256 algorithm
- **Auth Utils Module**: Created comprehensive `auth_utils.py` with encode_jwt(), decode_jwt(), and require_jwt_auth() functions
- **Login System**: Updated login endpoint to generate JWT tokens containing user information with 24-hour expiration
- **Protected Endpoints**: All API endpoints now require valid JWT tokens in Authorization header (Bearer format)
- **Token Validation**: Proper JWT token validation with expiration checks and error handling
- **Test Suite Update**: Updated test script to work with JWT authentication flow (login -> get token -> authenticate requests)
- **Documentation**: Updated API documentation to reflect JWT authentication requirements
- **Environment Config**: Simplified environment variables by removing API_TOKEN in favor of JWT_SECRET
- **Production Security**: Enhanced security with proper token-based authentication suitable for production use

### July 13, 2025 - PostgreSQL Database Integration
- **Database Configuration**: Successfully configured PostgreSQL database for the Bayt AlSudani marketplace platform
- **Schema Migration**: Applied complete database schema using Drizzle ORM with `npm run db:push`
- **Database Storage**: Transitioned from in-memory storage to persistent PostgreSQL database
- **Database Environment**: Added proper DATABASE_URL and PostgreSQL connection environment variables
- **Database Verification**: Confirmed database connectivity and proper schema initialization
- **Production Ready**: Database now ready for production use with proper persistence and scalability

### July 13, 2025 - Python Flask API Extension
- **Complete API Ecosystem**: Created comprehensive Python Flask API with 14 endpoints covering all marketplace functionality
- **MySQL Integration**: Full MySQL database connectivity with PyMySQL and SQLAlchemy support
- **Security Implementation**: API token authentication and JWT token generation for user sessions
- **Database Structure**: Complete MySQL schema for users, stores, products, services, jobs, and announcements
- **Individual Microservices**: Each endpoint can run independently on separate ports for microservice architecture
- **Unified Server**: Main server option to run all endpoints from single Flask application
- **Testing Suite**: Comprehensive test script for all API endpoints with proper error handling
- **Documentation**: Complete API documentation with usage examples and database schema
- **Environment Configuration**: Proper .env setup for database credentials and API security
- **CORS Support**: Full cross-origin resource sharing for frontend integration

### July 11, 2025 - Mobile App Enhancement with Country Selection
- **Country Selection Screen**: Added initial country selection screen supporting 8 Arab countries (Sudan, Egypt, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Kuwait)
- **Enhanced Mobile Navigation**: Redesigned bottom navigation to include Services, Jobs, and Announcements tabs
- **New Mobile Screens**: Created dedicated screens for Services, Jobs, and Announcements with Arabic interface
- **API Integration**: Enhanced API service with complete endpoints for services, jobs, and announcements
- **Navigation Flow**: Implemented country selection → login → main app flow with proper session management
- **Arabic UI**: All mobile screens fully support Arabic RTL layout with Sudanese cultural design elements
- **Data Integration**: Mobile app now fetches real data from existing backend API endpoints
- **Admin Dashboard Access**: Maintained separate admin dashboard access at `/admin/dashboard` (admin/admin credentials)

### July 10, 2025
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment
- **Authentication Fixed**: Resolved login API call issues in React components by correcting `apiRequest` function usage
- **Database Setup**: Configured SQLite database with proper schema initialization
- **Demo Data**: Added proper bcrypt-hashed passwords for all demo users (admin/admin for all accounts)
- **Type Safety**: Fixed TypeScript errors in storage layer by properly handling optional fields
- **Admin Dashboard Enhanced**: Complete admin panel with:
  - Real-time API statistics (Users, Stores, Products, Services, Jobs, Announcements)
  - Full tab navigation with proper empty states
  - Responsive design with loading indicators
  - Professional Arabic interface with RTL support
- **Merchant Dashboard**: Full merchant interface for managing stores, products, services, and jobs
- **Security**: Implemented proper JWT authentication with role-based access control
- **UX Improvements**: Added friendly "no data found" messages and smooth transitions across all admin tabs

### Working Login Credentials
- **Admin**: username: `admin`, password: `admin`
- **Merchant**: username: `merchant1`, password: `admin`
- **Customer**: username: `customer1`, password: `admin`

### July 10, 2025 - Login System Fix
- **Authentication Fixed**: Resolved fetch API parameter ordering issue in `apiRequest` function
- **Password Hash Updated**: Fixed bcrypt password verification for demo users in PostgreSQL
- **Database Connection**: Successfully connected to PostgreSQL with proper data persistence
- **Demo Data**: All demo users now have working credentials with proper password hashing

### July 10, 2025 - Enhanced Admin Dashboard
- **Store Details Page**: Created comprehensive `/admin/stores/:id` page showing all store information
- **Detailed Analytics**: Added cards showing counts of products, services, jobs, and announcements per store
- **Tabbed Interface**: Organized data into four sections: Products, Services, Jobs, and Announcements
- **Real Database Integration**: All data pulled from PostgreSQL with proper API endpoints
- **Interactive Navigation**: Added "View Details" buttons from main admin dashboard to store detail pages
- **Professional UI**: Clean, RTL-optimized interface with loading states and empty data messages
- **Extended Demo Data**: Added 2 additional stores, 3 products, 2 services, 2 jobs, and 2 announcements for testing

### July 10, 2025 - Complete UI Redesign to Modern E-commerce
- **Homepage Redesign**: Completely redesigned homepage with modern e-commerce interface similar to Amazon/Noon
- **Marketplace Page**: Created professional marketplace with advanced filtering, search, and grid/list views
- **Services Page**: Modern service marketplace with category filtering and professional service cards
- **Jobs Page**: Professional job board with location filtering and detailed job cards
- **Announcements Page**: Enhanced announcements with visual banners and type categorization
- **Unified Design**: All pages now follow consistent modern design with Sudanese cultural elements
- **Navigation & Footer**: Integrated professional navigation and footer components across all pages
- **Cultural Design**: Added Sudanese heritage colors (Blue, Red, Gold, Sand) with geometric patterns
- **Arabic Typography**: Enhanced with Cairo and Tajawal fonts for better Arabic text rendering
- **Responsive Layout**: All pages optimized for mobile, tablet, and desktop viewing

### July 10, 2025 - Migration to Traditional Authentication System
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment
- **Authentication System**: Replaced Replit OAuth with traditional username/password authentication
- **Database Setup**: Created PostgreSQL database with proper schema initialization and demo data
- **Session Management**: Simplified session handling without OAuth dependencies
- **REPLIT_DOMAINS Cleanup**: Removed all dependencies on REPLIT_DOMAINS environment variable
- **Login Interface**: Enhanced Arabic login page with proper username/password fields
- **Demo Credentials**: Added working demo accounts (admin/admin, merchant1/admin, customer1/admin)
- **JWT Authentication**: Implemented JWT token-based authentication for API security
- **Role-Based Access**: Maintained admin and merchant roles with proper dashboard routing
- **Error Resolution**: Fixed all authentication-related errors and environment variable issues

### July 10, 2025 - Complete Native Mobile App Transformation
- **React Native Migration**: Successfully transformed web app into full native mobile application using React Native and Expo
- **Mobile Architecture**: Created complete mobile app structure with navigation, context providers, and services
- **Arabic RTL Support**: Implemented proper right-to-left layout with Arabic fonts and cultural design elements
- **Sudanese Theme**: Applied cultural color scheme (Blue, Red, Gold, Sand) throughout the mobile interface
- **Mobile Screens**: Built all required screens - Login, Home, Profile, Marketplace, Create Store, Create Product, Store Details
- **Unified REST API**: Created comprehensive API endpoints that serve both mobile app and PHP web dashboard
- **PostgreSQL Integration**: Configured PostgreSQL database support with fallback to in-memory storage
- **Authentication System**: Implemented JWT-based authentication for mobile app security
- **PHP Dashboard**: Created complete PHP web dashboard structure for admin management
- **Data Synchronization**: Unified REST API ensures data consistency between mobile app and web dashboard
- **Mobile Features**: Advanced filtering, search, user management, store creation, product management
- **Production Ready**: Mobile app configured for both Android and iOS deployment through Expo

### Working Mobile App Features
- **Authentication**: Login/register with JWT tokens
- **Home Screen**: Featured products, stores, and quick actions
- **Marketplace**: Advanced search and filtering for products and stores
- **User Profile**: Complete profile management with stats and settings
- **Store Management**: Create and manage stores with full form validation
- **Product Management**: Add products to stores with category selection
- **Store Details**: Comprehensive store view with contact options and product listings
- **Arabic Interface**: Full RTL support with cultural design elements

### July 10, 2025 - Database Configuration Update
- **Database Setup**: Configured flexible database system supporting both PostgreSQL and in-memory storage
- **Health Monitoring**: Added database health check endpoints (/api/db-status, /api/health)
- **Database Guide**: Created comprehensive DATABASE_SETUP.md with setup instructions for multiple providers
- **Error Handling**: Improved database connection error handling with proper fallback to in-memory storage
- **Production Ready**: App works seamlessly with or without database, ready for PostgreSQL when provisioned
- **API Enhancement**: Added unified REST API routes for mobile app and PHP dashboard integration

### July 10, 2025 - Enhanced Merchant Experience
- **Smart User Detection**: Added automatic detection of merchant vs customer roles
- **Merchant Onboarding**: Created prominent alert banner for new merchants without stores
- **Dynamic Homepage**: Homepage adapts based on user role (merchant tools vs customer access)
- **Quick Access Repositioning**: Moved navigation options to top half of homepage as requested
- **Merchant-Specific UI**: Added gradient styling and special sections for store owners
- **Seamless Store Creation**: Direct pathways for merchants to create and manage stores

### July 10, 2025 - Major Project Reorganization for Mobile + PHP Architecture
- **Project Structure Reorganization**: Completely restructured project into three main directories:
  - `admin/` - PHP-based admin dashboard with session protection
  - `api/` - JSON-only PHP API endpoints for mobile app integration
  - `mobile_app/` - React Native and React web applications
- **PHP Admin Dashboard**: Created complete PHP admin interface with:
  - `dashboard.php` - Main admin dashboard with statistics
  - `login_admin.php` - Secure admin login with session management
  - `manage_users.php` - User management (activate/deactivate, role changes)
  - `logout.php` - Secure logout functionality
- **RESTful API Endpoints**: Built comprehensive PHP API structure:
  - Authentication endpoints (login, register)
  - CRUD operations for stores, products, services, jobs, announcements
  - CORS support for mobile app integration
  - JSON-only responses with proper error handling
- **Mobile App Structure**: Organized mobile applications:
  - Moved React Native files to `mobile_app/` root
  - Moved React web app to `mobile_app/web/`
  - Maintained package.json for mobile dependencies
- **Database Configuration**: Created centralized PHP database configuration with PostgreSQL support
- **Security Enhancement**: Implemented proper session management, CORS headers, and input validation
- **Documentation**: Created comprehensive README.md explaining the new architecture
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment

### July 10, 2025 - Database Setup and Enhanced Store Categories
- **Database Support**: Added comprehensive PostgreSQL database support with flexible fallback to in-memory storage
- **Health Monitoring**: Added `/api/health` and `/api/db-status` endpoints for monitoring database connection
- **Database Guide**: Created detailed `DATABASE_SETUP.md` with step-by-step instructions for multiple database providers
- **Expanded Store Categories**: Added 16 comprehensive store categories including electronics, fashion, food, handicrafts, agriculture, and more
- **Merchant Dashboard Fix**: Fixed merchant dashboard to show only user's own stores instead of all stores
- **Data Persistence**: Application ready for PostgreSQL when DATABASE_URL is provided, with seamless migration from in-memory storage

### July 10, 2025 - Mobile Product Display Optimization
- **Compact Product View**: Created compact ProductCard component variant for mobile devices with smaller dimensions
- **Responsive View Modes**: Added automatic mobile detection with view mode toggles (grid/list) including Arabic text labels
- **Mobile-First Categories**: Updated categories section with improved 2x4 grid layout and color-coded background styling
- **Homepage Enhancement**: Optimized homepage to use compact product cards automatically on mobile devices
- **Marketplace Improvements**: Enhanced marketplace with better mobile navigation and smaller card gaps for mobile screens
- **View Mode Controls**: Added responsive view mode buttons with text labels on mobile and icon-only on desktop
- **Category Colors**: Implemented color-coded category cards matching modern e-commerce design standards

### July 10, 2025 - Separate Stores and Restaurants Navigation
- **Navigation Enhancement**: Added separate "المتاجر" (Stores) and "المطاعم" (Restaurants) sections in main navigation
- **Stores Page**: Created dedicated stores page filtering out restaurants, showing only general retail stores
- **Restaurants Page**: Created specialized restaurants page with orange theme and restaurant-specific features
- **Demo Data**: Added comprehensive demo data: 6 stores/restaurants, 10 products, 4 services, 5 jobs, 6 announcements
- **Authentication Fix**: Resolved store creation authentication issues for merchant users
- **Icon Enhancement**: Added ChefHat icon for restaurants to distinguish from general stores
- **Real-time Updates**: Added automatic refresh functionality to show newly created stores immediately
- **Category Filtering Fix**: Fixed filtering logic to properly display restaurants and stores in correct sections
- **User Experience**: Added auto-redirect and success messages for store creation workflow

### July 10, 2025 - Comprehensive PWA Enhancement
- **Advanced PWA Manifest**: Created comprehensive manifest.json with all PWA features including screenshots, edge_side_panel, file_handlers, handle_links, and protocol_handlers
- **Service Worker**: Implemented full-featured service worker with caching, offline support, and protocol handling
- **File Handler Support**: Added support for CSV, PDF, Excel, and JSON file imports through PWA file handling
- **Protocol Handlers**: Implemented custom protocol support (web+sudanese-market:// and web+bayt-sudani://)
- **PWA Routes**: Created dedicated pages for file import (/import-data) and protocol link handling (/handle-link)
- **Enhanced Metadata**: Added comprehensive meta tags, Open Graph tags, and Apple Touch icon support
- **App Shortcuts**: Configured app shortcuts for quick access to marketplace, stores, services, and jobs
- **Edge Integration**: Added Microsoft Edge side panel support for enhanced user experience
- **Icon Structure**: Set up complete icon structure with all required sizes (72x72 to 512x512) and shortcut icons
- **Screenshot Guidelines**: Created documentation for required PWA store screenshots (desktop and mobile formats)
- **Offline Capability**: Implemented offline functionality with intelligent caching strategies
- **Store Optimization**: Prepared manifest for PWA store submission with all required fields and enhancements

### July 11, 2025 - Mobile App Transformation with Country Selection
- **Country Selection Screen**: Created comprehensive country selection screen with 8 Arab countries (السودان، مصر، السعودية، الإمارات، قطر، البحرين، عُمان، الكويت)
- **Complete Mobile Navigation**: Transformed mobile app with 5 main sections: Home, Stores, Services, Jobs, and Announcements
- **Arabic RTL Interface**: Full Arabic interface with proper RTL support and Sudanese cultural design elements
- **Enhanced API Integration**: Extended API service with comprehensive endpoints for services, jobs, and announcements
- **Navigation Flow**: Implemented proper navigation flow: Country Selection → Login → Main App
- **Sudanese Theme**: Applied cultural color scheme and typography throughout the mobile interface
- **Mobile-First Design**: Optimized all screens for mobile devices with proper spacing and touch targets
- **Data Integration**: Connected all screens to existing backend API endpoints for real-time data
- **User Experience**: Added loading states, error handling, and refresh functionality across all screens
- **Role-Based Access**: Maintained proper authentication and user role handling for different user types