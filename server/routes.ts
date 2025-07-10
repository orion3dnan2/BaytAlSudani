import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { authenticateToken, requireAdmin, requireStoreOwner, type AuthenticatedRequest } from "./middleware/auth";
import { insertStoreSchema, insertProductSchema, insertServiceSchema, insertJobSchema, insertAnnouncementSchema } from "@shared/schema";
import { setupAuth } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes handled by /api/auth routes in index.ts

  // Test route to debug user data
  app.get('/api/test-users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role })));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Users routes (Admin only)
  app.get('/api/users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getLegacyUser(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { fullName, email, phone } = req.body;
      
      // Check if user can edit this profile (must be owner or admin)
      if (req.user!.id !== id.toString() && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      const updatedUser = await storage.updateUser(id, { fullName, email, phone });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Stores routes
  app.get('/api/stores', async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/stores/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.getStore(id);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      res.json(store);
    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/stores/owner/:ownerId', async (req, res) => {
    try {
      const { ownerId } = req.params;
      const stores = await storage.getStoresByOwner(ownerId);
      res.json(stores);
    } catch (error) {
      console.error('Error fetching stores by owner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/stores', authenticateToken, requireStoreOwner, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(validatedData);
      res.status(201).json(store);
    } catch (error) {
      console.error('Create store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get products by store
  app.get('/api/products/store/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const products = await storage.getProductsByStore(storeId);
      res.json(products);
    } catch (error) {
      console.error('Get products by store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/products', authenticateToken, requireStoreOwner, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      console.error('Get service error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get services by store
  app.get('/api/services/store/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const services = await storage.getServicesByStore(storeId);
      res.json(services);
    } catch (error) {
      console.error('Get services by store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/services', authenticateToken, requireStoreOwner, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Jobs routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get jobs by store
  app.get('/api/jobs/store/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const jobs = await storage.getJobsByStore(storeId);
      res.json(jobs);
    } catch (error) {
      console.error('Get jobs by store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/jobs', authenticateToken, requireStoreOwner, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Announcements routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Get announcements error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/announcements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = await storage.getAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      res.json(announcement);
    } catch (error) {
      console.error('Get announcement error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get announcements by store
  app.get('/api/announcements/store/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const announcements = await storage.getAnnouncementsByStore(storeId);
      res.json(announcements);
    } catch (error) {
      console.error('Get announcements by store error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/announcements', authenticateToken, requireStoreOwner, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      console.error('Create announcement error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
