import { Router } from 'express';
import { db, pool } from '../db';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: !!db,
        type: db ? 'postgresql' : 'in-memory'
      }
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/db-status', async (req, res) => {
  try {
    if (!db || !pool) {
      return res.json({
        status: 'disconnected',
        type: 'in-memory',
        message: 'Using in-memory storage. Set DATABASE_URL to use PostgreSQL.',
        timestamp: new Date().toISOString()
      });
    }

    // Test database connection
    const result = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'connected',
      type: 'postgresql',
      message: 'PostgreSQL database connected successfully',
      timestamp: new Date().toISOString(),
      server_time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      type: 'postgresql',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;