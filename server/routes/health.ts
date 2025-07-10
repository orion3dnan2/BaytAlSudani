import { Router } from 'express';
import { db, pool } from '../db';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        api: 'ok'
      }
    };

    // Check database connection
    if (db && pool) {
      try {
        // Simple query to test database connection
        await db.execute('SELECT 1');
        status.services.database = 'connected';
      } catch (error) {
        status.services.database = 'error';
        status.status = 'degraded';
      }
    } else {
      status.services.database = 'not_configured';
      status.status = 'degraded';
    }

    const httpStatus = status.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(status);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Database status endpoint
router.get('/db-status', async (req, res) => {
  try {
    if (!db || !pool) {
      return res.json({
        connected: false,
        message: 'Database not configured. Using in-memory storage.',
        setup_guide: '/DATABASE_SETUP.md'
      });
    }

    // Test database connection with a simple query
    await db.execute('SELECT NOW()');
    
    res.json({
      connected: true,
      message: 'Database connection successful',
      type: 'PostgreSQL'
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      message: 'Database connection failed',
      error: error.message,
      setup_guide: '/DATABASE_SETUP.md'
    });
  }
});

export default router;