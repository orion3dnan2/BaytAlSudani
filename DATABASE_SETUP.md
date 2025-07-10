# Database Setup Guide for البيت السوداني

## Overview
Your البيت السوداني mobile marketplace is configured to work with both PostgreSQL (for production) and in-memory storage (for development). This guide will help you set up a PostgreSQL database.

## Current Status
- ✅ Mobile app is fully functional with in-memory storage
- ✅ Database schema is defined and ready
- ✅ Storage layer supports both PostgreSQL and in-memory fallback
- ⏳ PostgreSQL database needs to be provisioned

## Database Setup Options

### Option 1: Replit Database (Recommended)
1. Go to your Replit project
2. Click on "Database" in the sidebar
3. Choose "PostgreSQL" 
4. Click "Create Database"
5. The `DATABASE_URL` environment variable will be automatically set

### Option 2: External PostgreSQL Provider
You can use any PostgreSQL provider:

#### Popular Options:
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available) 
- **PlanetScale**: https://planetscale.com (Free tier available)
- **ElephantSQL**: https://www.elephantsql.com (Free tier available)

#### Setup Steps:
1. Create an account with your chosen provider
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add it to your Replit environment variables:
   - Go to your Replit project
   - Open the "Secrets" tab
   - Add key: `DATABASE_URL`
   - Add value: Your PostgreSQL connection string

### Option 3: Local PostgreSQL (Development)
If running locally:
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql postgresql-contrib  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start  # Ubuntu

# Create database
createdb bait_sudani

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/bait_sudani"
```

## Database Schema Migration

Once you have set up your PostgreSQL database:

1. **Push the schema** (creates all tables):
   ```bash
   npm run db:push
   ```

2. **Verify the setup**:
   ```bash
   npm run dev
   ```
   
   You should see: "DATABASE_URL found. Initializing PostgreSQL connection..."

## Database Schema

Your database will include these tables:

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique) 
- `password_hash`
- `full_name`
- `phone`
- `role` (admin, merchant, customer)
- `is_active`
- `created_at`
- `updated_at`

### Stores Table
- `id` (Primary Key)
- `name`
- `description`
- `owner_id` (Foreign Key → users.id)
- `category`
- `address`
- `phone`
- `is_active`
- `created_at`
- `updated_at`

### Products Table
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `store_id` (Foreign Key → stores.id)
- `category`
- `is_active`
- `created_at`
- `updated_at`

### Services Table
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `store_id` (Foreign Key → stores.id)
- `category`
- `is_active`
- `created_at`
- `updated_at`

### Jobs Table
- `id` (Primary Key)
- `title`
- `description`
- `salary`
- `location`
- `store_id` (Foreign Key → stores.id)
- `is_active`
- `created_at`
- `updated_at`

### Announcements Table
- `id` (Primary Key)
- `title`
- `content`
- `store_id` (Foreign Key → stores.id)
- `is_active`
- `created_at`
- `updated_at`

## Features After Database Setup

Once PostgreSQL is connected, you'll have:

### Data Persistence
- All user accounts, stores, and products will be permanently saved
- Data survives app restarts and deployments
- Real-time synchronization between mobile app and web dashboard

### Advanced Features
- User authentication with secure password hashing
- Role-based access control (admin, merchant, customer)
- Store ownership and management
- Product catalog with categories and pricing
- Search and filtering capabilities
- Analytics and reporting data

### Mobile App Integration
- All mobile app features work seamlessly with the database
- User profiles sync across devices
- Store and product data is real-time
- Authentication tokens are properly managed

### PHP Web Dashboard
- Admin panel with full database access
- User management and store approval system
- Analytics dashboard with real data
- Content management for products and services

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check that DATABASE_URL is correct and accessible
2. **Schema Errors**: Run `npm run db:push` to ensure schema is up to date
3. **Permission Errors**: Verify database user has proper permissions
4. **SSL Issues**: Some providers require SSL connections

### Debug Commands:
```bash
# Check if database is configured
echo $DATABASE_URL

# Test database connection
npm run db:push

# View application logs
npm run dev
```

## Next Steps

1. **Choose a database provider** from the options above
2. **Set up your database** and get the connection string
3. **Add DATABASE_URL** to your environment variables
4. **Run the migration** with `npm run db:push`
5. **Test your app** to ensure everything works

Your البيت السوداني mobile marketplace is ready to scale with a proper database backend!

## Support

If you need help with database setup:
- Check provider documentation for connection strings
- Verify network connectivity to your database
- Review application logs for specific error messages
- Test with a simple database query first

Remember: Your app works perfectly with in-memory storage for development and testing, so you can continue building features while setting up the database.