import { users, legacyUsers, stores, products, services, jobs, announcements, type User, type UpsertUser, type InsertUser, type Store, type InsertStore, type Product, type InsertProduct, type Service, type InsertService, type Job, type InsertJob, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { eq } from "drizzle-orm";

// Database imports for DatabaseStorage class
import bcrypt from "bcryptjs";

// Import database connection for PostgreSQL
import { db } from "./db";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legacy user operations (for existing system)
  getLegacyUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Stores
  getStore(id: number): Promise<Store | undefined>;
  getStoresByOwner(ownerId: string): Promise<Store[]>;
  getStoresByCategory(category: string): Promise<Store[]>;
  getAllStores(): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<boolean>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByStore(storeId: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Services
  getService(id: number): Promise<Service | undefined>;
  getServicesByStore(storeId: number): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getAllServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Jobs
  getJob(id: number): Promise<Job | undefined>;
  getJobsByStore(storeId: number): Promise<Job[]>;
  getAllJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;
  
  // Announcements
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncementsByStore(storeId: number): Promise<Announcement[]>;
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private stores: Store[] = [];
  private products: Product[] = [];
  private services: Service[] = [];
  private jobs: Job[] = [];
  private announcements: Announcement[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const adminUser: User = {
      id: 1,
      username: 'admin',
      password: '$2b$10$/F6rukuamJgtsR39GfvMUeCUomJEjNfybAhc9NQmVRPt3AVOVg1Ea', // password: admin
      email: 'admin@example.com',
      fullName: 'مدير النظام',
      phone: '123456789',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
    };

    const storeOwner: User = {
      id: 2,
      username: 'merchant1',
      password: '$2b$10$/F6rukuamJgtsR39GfvMUeCUomJEjNfybAhc9NQmVRPt3AVOVg1Ea', // password: admin
      email: 'merchant@example.com',
      fullName: 'أحمد التاجر',
      phone: '987654321',
      role: 'store_owner',
      isActive: true,
      createdAt: new Date(),
    };

    const customer: User = {
      id: 3,
      username: 'customer1',
      password: '$2b$10$/F6rukuamJgtsR39GfvMUeCUomJEjNfybAhc9NQmVRPt3AVOVg1Ea', // password: admin
      email: 'customer@example.com',
      fullName: 'فاطمة العميل',
      phone: '555666777',
      role: 'customer',
      isActive: true,
      createdAt: new Date(),
    };

    this.users = [adminUser, storeOwner, customer];

    // Create demo stores
    const demoStore: Store = {
      id: 1,
      name: 'متجر الأحذية السودانية',
      description: 'متجر متخصص في الأحذية التراثية والعصرية',
      ownerId: 2,
      category: 'أحذية ولباس',
      address: 'الخرطوم - شارع الجمهورية',
      phone: '0183456789',
      isActive: true,
      createdAt: new Date(),
    };

    this.stores = [demoStore];

    // Create demo products
    const demoProduct: Product = {
      id: 1,
      name: 'حذاء جلدي سوداني',
      description: 'حذاء جلدي طبيعي مصنوع يدوياً بالطرق التقليدية',
      price: '250',
      storeId: 1,
      category: 'أحذية رجالي',
      isActive: true,
      createdAt: new Date(),
    };

    this.products = [demoProduct];

    // Create demo services
    const demoService: Service = {
      id: 1,
      name: 'خدمة تفصيل الأحذية',
      description: 'تفصيل أحذية حسب الطلب والمقاس',
      price: '400',
      storeId: 1,
      category: 'خدمات تفصيل',
      isActive: true,
      createdAt: new Date(),
    };

    this.services = [demoService];

    // Create demo jobs
    const demoJob: Job = {
      id: 1,
      title: 'مطلوب خبير في صناعة الأحذية',
      description: 'نبحث عن خبير في صناعة الأحذية التقليدية',
      salary: '1500',
      location: 'الخرطوم',
      storeId: 1,
      isActive: true,
      createdAt: new Date(),
    };

    this.jobs = [demoJob];

    // Create demo announcements
    const demoAnnouncement: Announcement = {
      id: 1,
      title: 'عرض خاص للعيد',
      content: 'خصم 30% على جميع المنتجات بمناسبة العيد المبارك',
      storeId: 1,
      isActive: true,
      createdAt: new Date(),
    };

    this.announcements = [demoAnnouncement];

    this.nextId = 4; // Start from 4 since we have 3 initial users
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    // For Replit Auth, users have string IDs
    return undefined; // Not implemented in memory storage
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // For Replit Auth, upsert user data
    const user: User = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || 'user',
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    // In memory storage, we don't actually store Replit users
    return user;
  }

  // Legacy user operations
  async getLegacyUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextId++,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName,
      phone: insertUser.phone ?? null,
      role: insertUser.role ?? 'customer',
      isActive: true,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.find(s => s.id === id);
  }

  async getStoresByOwner(ownerId: string): Promise<Store[]> {
    return this.stores.filter(s => s.ownerId === ownerId);
  }

  async getStoresByCategory(category: string): Promise<Store[]> {
    return this.stores.filter(s => s.category === category);
  }

  async getAllStores(): Promise<Store[]> {
    return [...this.stores];
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const store: Store = {
      id: this.nextId++,
      name: insertStore.name,
      description: insertStore.description ?? null,
      ownerId: insertStore.ownerId,
      category: insertStore.category,
      address: insertStore.address ?? null,
      phone: insertStore.phone ?? null,
      isActive: true,
      createdAt: new Date(),
    };
    this.stores.push(store);
    return store;
  }

  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    const index = this.stores.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.stores[index] = { ...this.stores[index], ...storeData };
    return this.stores[index];
  }

  async deleteStore(id: number): Promise<boolean> {
    const index = this.stores.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.stores.splice(index, 1);
    return true;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    return this.products.filter(p => p.storeId === storeId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      id: this.nextId++,
      name: insertProduct.name,
      description: insertProduct.description ?? null,
      price: insertProduct.price,
      storeId: insertProduct.storeId,
      category: insertProduct.category,
      isActive: true,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.products[index] = { ...this.products[index], ...productData };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    return this.services.find(s => s.id === id);
  }

  async getServicesByStore(storeId: number): Promise<Service[]> {
    return this.services.filter(s => s.storeId === storeId);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.services.filter(s => s.category === category);
  }

  async getAllServices(): Promise<Service[]> {
    return [...this.services];
  }

  async createService(insertService: InsertService): Promise<Service> {
    const service: Service = {
      id: this.nextId++,
      name: insertService.name,
      description: insertService.description ?? null,
      price: insertService.price ?? null,
      storeId: insertService.storeId,
      category: insertService.category,
      isActive: true,
      createdAt: new Date(),
    };
    this.services.push(service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.services[index] = { ...this.services[index], ...serviceData };
    return this.services[index];
  }

  async deleteService(id: number): Promise<boolean> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.services.splice(index, 1);
    return true;
  }

  // Jobs
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.find(j => j.id === id);
  }

  async getJobsByStore(storeId: number): Promise<Job[]> {
    return this.jobs.filter(j => j.storeId === storeId);
  }

  async getAllJobs(): Promise<Job[]> {
    return [...this.jobs];
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const job: Job = {
      id: this.nextId++,
      title: insertJob.title,
      description: insertJob.description ?? null,
      salary: insertJob.salary ?? null,
      location: insertJob.location ?? null,
      storeId: insertJob.storeId,
      isActive: true,
      createdAt: new Date(),
    };
    this.jobs.push(job);
    return job;
  }

  async updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | undefined> {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) return undefined;
    
    this.jobs[index] = { ...this.jobs[index], ...jobData };
    return this.jobs[index];
  }

  async deleteJob(id: number): Promise<boolean> {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) return false;
    
    this.jobs.splice(index, 1);
    return true;
  }

  // Announcements
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.find(a => a.id === id);
  }

  async getAnnouncementsByStore(storeId: number): Promise<Announcement[]> {
    return this.announcements.filter(a => a.storeId === storeId);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return [...this.announcements];
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const announcement: Announcement = {
      id: this.nextId++,
      createdAt: new Date(),
      isActive: true,
      ...insertAnnouncement
    };
    this.announcements.push(announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, announcementData: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.announcements[index] = { ...this.announcements[index], ...announcementData };
    return this.announcements[index];
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.announcements.splice(index, 1);
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Legacy user operations (for existing system)
  async getLegacyUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(legacyUsers).where(eq(legacyUsers.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async getStoresByOwner(ownerId: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.ownerId, ownerId));
  }

  async getStoresByCategory(category: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.category, category));
  }

  async getAllStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db
      .insert(stores)
      .values(insertStore)
      .returning();
    return store;
  }

  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    const [store] = await db
      .update(stores)
      .set(storeData)
      .where(eq(stores.id, id))
      .returning();
    return store || undefined;
  }

  async deleteStore(id: number): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.storeId, storeId));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async getServicesByStore(storeId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.storeId, storeId));
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.category, category));
  }

  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Jobs
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobsByStore(storeId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.storeId, storeId));
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isActive, true));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(jobData)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Announcements
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement || undefined;
  }

  async getAnnouncementsByStore(storeId: number): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.storeId, storeId));
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(insertAnnouncement)
      .returning();
    return announcement;
  }

  async updateAnnouncement(id: number, announcementData: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [announcement] = await db
      .update(announcements)
      .set(announcementData)
      .where(eq(announcements.id, id))
      .returning();
    return announcement || undefined;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return (result.rowCount || 0) > 0;
  }
}

// Initialize storage based on database availability
export const storage = (db && process.env.DATABASE_URL) ? new DatabaseStorage() : new MemStorage();
