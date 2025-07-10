# Database Setup Guide

This guide will help you set up a PostgreSQL database for your Sudanese marketplace application.

## Option 1: Replit Database (Recommended)

1. **Go to the Replit Console**
   - Click on the "Tools" tab in your Replit sidebar
   - Select "Database" 
   - Click "Create Database"
   - Choose "PostgreSQL"

2. **Get Connection Details**
   - After creation, copy the `DATABASE_URL` provided
   - It should look like: `postgresql://username:password@host:port/database`

3. **Set Environment Variable**
   - Go to the "Secrets" tab in Replit
   - Add a new secret with key: `DATABASE_URL`
   - Paste the database URL as the value

## Option 2: External PostgreSQL Service

You can use services like:
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)
- **ElephantSQL**: https://www.elephantsql.com (Free tier available)
- **Railway**: https://railway.app (Free tier available)

### Steps for External Service:
1. Create an account on your chosen service
2. Create a new PostgreSQL database
3. Copy the connection string (DATABASE_URL)
4. Add it to Replit Secrets as `DATABASE_URL`

## Option 3: Local Development

If running locally:
```bash
# Install PostgreSQL locally
# Create a database
createdb myapp_dev

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/myapp_dev"
```

## After Setting Up Database

Once you have the DATABASE_URL set:

1. **Push Database Schema**
   ```bash
   npm run db:push
   ```

2. **Restart the Application**
   - The app will automatically detect the DATABASE_URL
   - It will switch from in-memory storage to PostgreSQL
   - All your data will persist between restarts

## Database Schema

The application includes these tables:
- `users` - User accounts and authentication
- `stores` - Merchant stores
- `products` - Product listings
- `services` - Service offerings
- `jobs` - Job postings
- `announcements` - Store announcements

## Verification

After setup, check the console logs. You should see:
```
DATABASE_URL found. Initializing PostgreSQL connection...
```

Instead of:
```
DATABASE_URL not set. Database operations will use in-memory storage.
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Verify the DATABASE_URL is correct
   - Check firewall settings
   - Ensure database service is running

2. **Authentication Failed**
   - Double-check username and password
   - Verify database exists

3. **SSL Issues**
   - Some services require SSL: add `?sslmode=require` to URL
   - Example: `postgresql://user:pass@host:5432/db?sslmode=require`

### Getting Help

If you encounter issues:
1. Check the Replit console for error messages
2. Verify the DATABASE_URL in secrets
3. Try recreating the database connection

## Data Migration

The current in-memory data includes:
- Demo admin, merchant, and customer accounts
- Sample store (متجر الأحذية السودانية)
- Sample products, services, jobs, and announcements

After connecting to PostgreSQL, you can:
1. Keep using the demo data for testing
2. Create new stores and products through the UI
3. Clear demo data and start fresh

## Next Steps

After database setup:
1. Create your first store through the merchant dashboard
2. Add products to your store
3. Test the full merchant workflow
4. Your data will now persist between application restarts!