import { users, stores, products, services, jobs, announcements, type User, type InsertUser, type Store, type InsertStore, type Product, type InsertProduct, type Service, type InsertService, type Job, type InsertJob, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stores
  getStore(id: number): Promise<Store | undefined>;
  getStoresByOwner(ownerId: number): Promise<Store[]>;
  getStoresByCategory(category: string): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByStore(storeId: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Services
  getService(id: number): Promise<Service | undefined>;
  getServicesByStore(storeId: number): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Jobs
  getJob(id: number): Promise<Job | undefined>;
  getJobsByStore(storeId: number): Promise<Job[]>;
  getAllJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Announcements
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncementsByStore(storeId: number): Promise<Announcement[]>;
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async getStoresByOwner(ownerId: number): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.ownerId, ownerId));
  }

  async getStoresByCategory(category: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.category, category));
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db
      .insert(stores)
      .values(insertStore)
      .returning();
    return store;
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

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
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

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
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
}

export const storage = new DatabaseStorage();
