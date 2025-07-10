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

### July 10, 2025 - Database Setup and Enhanced Store Categories
- **Database Support**: Added comprehensive PostgreSQL database support with flexible fallback to in-memory storage
- **Health Monitoring**: Added `/api/health` and `/api/db-status` endpoints for monitoring database connection
- **Database Guide**: Created detailed `DATABASE_SETUP.md` with step-by-step instructions for multiple database providers
- **Expanded Store Categories**: Added 16 comprehensive store categories including electronics, fashion, food, handicrafts, agriculture, and more
- **Merchant Dashboard Fix**: Fixed merchant dashboard to show only user's own stores instead of all stores
- **Data Persistence**: Application ready for PostgreSQL when DATABASE_URL is provided, with seamless migration from in-memory storage

### July 10, 2025 - Separate Stores and Restaurants Navigation
- **Navigation Enhancement**: Added separate "المتاجر" (Stores) and "المطاعم" (Restaurants) sections in main navigation
- **Stores Page**: Created dedicated stores page filtering out restaurants, showing only general retail stores
- **Restaurants Page**: Created specialized restaurants page with orange theme and restaurant-specific features
- **Demo Data**: Added restaurant demo data including "مطعم الأصالة السودانية" with traditional Sudanese meals
- **Authentication Fix**: Resolved store creation authentication issues for merchant users
- **Icon Enhancement**: Added ChefHat icon for restaurants to distinguish from general stores