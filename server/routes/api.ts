import { Router } from 'express';
import { storage } from '../storage';
import { insertUserSchema, insertStoreSchema, insertProductSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // For now, we'll skip JWT verification and just check for presence
  // In production, verify JWT token properly
  req.user = { id: '1', role: 'user' };
  next();
};

// CORS middleware for mobile app
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Auth routes
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate a simple token (in production, use proper JWT)
    const token = `token_${user.id}_${Date.now()}`;
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const user = await storage.createUser(userData);
    const token = `token_${user.id}_${Date.now()}`;
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid user data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await storage.getLegacyUser(parseInt(req.user.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users routes
router.get('/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await storage.getLegacyUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/users/profile', authenticateToken, async (req, res) => {
  try {
    const userData = req.body;
    const user = await storage.updateUser(parseInt(req.user.id), userData);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stores routes
router.get('/stores', async (req, res) => {
  try {
    const stores = await storage.getAllStores();
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stores/:id', async (req, res) => {
  try {
    const store = await storage.getStore(parseInt(req.params.id));
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/stores', authenticateToken, async (req, res) => {
  try {
    const storeData = insertStoreSchema.parse({
      ...req.body,
      ownerId: req.user.id,
    });
    
    const store = await storage.createStore(storeData);
    res.status(201).json(store);
  } catch (error) {
    console.error('Create store error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid store data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/stores/:id', authenticateToken, async (req, res) => {
  try {
    const storeData = req.body;
    const store = await storage.updateStore(parseInt(req.params.id), storeData);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/stores/:id', authenticateToken, async (req, res) => {
  try {
    const success = await storage.deleteStore(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products routes
router.get('/products', async (req, res) => {
  try {
    const products = await storage.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await storage.getProduct(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/store/:storeId', async (req, res) => {
  try {
    const products = await storage.getProductsByStore(parseInt(req.params.storeId));
    res.json(products);
  } catch (error) {
    console.error('Get products by store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', authenticateToken, async (req, res) => {
  try {
    const productData = insertProductSchema.parse(req.body);
    const product = await storage.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const productData = req.body;
    const product = await storage.updateProduct(parseInt(req.params.id), productData);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const success = await storage.deleteProduct(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Services routes
router.get('/services', async (req, res) => {
  try {
    const services = await storage.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await storage.getService(parseInt(req.params.id));
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Jobs routes
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await storage.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await storage.getJob(parseInt(req.params.id));
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Announcements routes
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await storage.getAllAnnouncements();
    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/announcements/:id', async (req, res) => {
  try {
    const announcement = await storage.getAnnouncement(parseInt(req.params.id));
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;