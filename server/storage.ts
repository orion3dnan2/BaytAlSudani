import { users, legacyUsers, stores, products, services, jobs, announcements, type User, type UpsertUser, type InsertUser, type Store, type InsertStore, type Product, type InsertProduct, type Service, type InsertService, type Job, type InsertJob, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { eq } from "drizzle-orm";

// Database imports for DatabaseStorage class
import bcrypt from "bcryptjs";
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
  private nextId = 10;

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
      phone: '0123456789',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
    };

    const storeOwner: User = {
      id: 2,
      username: 'merchant1',
      password: '$2b$10$/F6rukuamJgtsR39GfvMUeCUomJEjNfybAhc9NQmVRPt3AVOVg1Ea', // password: admin
      email: 'merchant1@example.com',
      fullName: 'محمد التاجر',
      phone: '0123456788',
      role: 'merchant',
      isActive: true,
      createdAt: new Date(),
    };

    const customer: User = {
      id: 3,
      username: 'customer1',
      password: '$2b$10$/F6rukuamJgtsR39GfvMUeCUomJEjNfybAhc9NQmVRPt3AVOVg1Ea', // password: admin
      email: 'customer@example.com',
      fullName: 'فاطمة العميل',
      phone: '0123456777',
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
      ownerId: "2",
      category: 'أحذية ولباس',
      address: 'الخرطوم - شارع الجمهورية',
      phone: '0183456789',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo restaurant
    const demoRestaurant: Store = {
      id: 2,
      name: 'مطعم الأصالة السودانية',
      description: 'مطعم يقدم أشهى الأطباق السودانية التقليدية مثل الملاح والمولاح والكسرة',
      ownerId: "2",
      category: 'restaurants-cafes',
      address: 'الخرطوم - شارع النيل',
      phone: '0183456790',
      isActive: true,
      createdAt: new Date(),
    };

    // Create additional demo stores
    const demoElectronicsStore: Store = {
      id: 3,
      name: 'متجر الإلكترونيات العصرية',
      description: 'متجر متخصص في أحدث الأجهزة الإلكترونية والهواتف الذكية',
      ownerId: "2",
      category: 'electronics',
      address: 'الخرطوم - شارع البلدية',
      phone: '0183456792',
      isActive: true,
      createdAt: new Date(),
    };

    const demoFashionStore: Store = {
      id: 4,
      name: 'بوتيك الأناقة السودانية',
      description: 'أزياء سودانية حديثة وتقليدية للنساء والرجال',
      ownerId: "2",
      category: 'fashion',
      address: 'الخرطوم - السوق العربي',
      phone: '0183456793',
      isActive: true,
      createdAt: new Date(),
    };

    // Create additional restaurants
    const demoCafe: Store = {
      id: 5,
      name: 'كافيه النيل الأزرق',
      description: 'كافيه حديث يقدم أفضل المشروبات الساخنة والباردة مع إطلالة على النيل',
      ownerId: "2",
      category: 'restaurants-cafes',
      address: 'الخرطوم - كورنيش النيل',
      phone: '0183456794',
      isActive: true,
      createdAt: new Date(),
    };

    const demoFastFood: Store = {
      id: 6,
      name: 'مطعم البرجر السوداني',
      description: 'مطعم وجبات سريعة يقدم البرجر والفرايز بالطعم السوداني الأصيل',
      ownerId: "2",
      category: 'restaurants-cafes',
      address: 'الخرطوم - شارع الجامعة',
      phone: '0183456795',
      isActive: true,
      createdAt: new Date(),
    };

    this.stores = [demoStore, demoRestaurant, demoElectronicsStore, demoFashionStore, demoCafe, demoFastFood];

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

    // Create demo restaurant product (meal)
    const demoMeal: Product = {
      id: 2,
      name: 'ملاح أصيل سوداني',
      description: 'ملاح طازج مطبوخ بالطريقة التقليدية مع اللحمة والخضار',
      price: '35',
      storeId: 2,
      category: 'مطاعم وكافيهات',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo products for electronics store
    const demoPhone: Product = {
      id: 3,
      name: 'هاتف ذكي سامسونج جالاكسي',
      description: 'هاتف ذكي حديث بمواصفات عالية وكاميرا ممتازة',
      price: '1200',
      storeId: 3,
      category: 'الإلكترونيات',
      isActive: true,
      createdAt: new Date(),
    };

    const demoLaptop: Product = {
      id: 4,
      name: 'لابتوب ديل للأعمال',
      description: 'لابتوب عالي الأداء مناسب للعمل والدراسة',
      price: '2500',
      storeId: 3,
      category: 'الإلكترونيات',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo products for fashion store
    const demoThobe: Product = {
      id: 5,
      name: 'جلابية سودانية رجالي',
      description: 'جلابية سودانية تقليدية مصنوعة من القطن الخالص',
      price: '180',
      storeId: 4,
      category: 'الأزياء والملابس',
      isActive: true,
      createdAt: new Date(),
    };

    const demoToub: Product = {
      id: 6,
      name: 'توب سوداني حريمي',
      description: 'توب سوداني أصيل بألوان زاهية وتطريز يدوي',
      price: '220',
      storeId: 4,
      category: 'الأزياء والملابس',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo cafe products
    const demoCoffee: Product = {
      id: 7,
      name: 'قهوة سودانية أصيلة',
      description: 'قهوة سودانية محمصة طازجة مع الحليب والهيل',
      price: '15',
      storeId: 5,
      category: 'مطاعم وكافيهات',
      isActive: true,
      createdAt: new Date(),
    };

    const demoJuice: Product = {
      id: 8,
      name: 'عصير المانجو الطازج',
      description: 'عصير مانجو طبيعي 100% بدون إضافات صناعية',
      price: '12',
      storeId: 5,
      category: 'مطاعم وكافيهات',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo fast food products
    const demoBurger: Product = {
      id: 9,
      name: 'برجر النيل الخاص',
      description: 'برجر لحم طازج مع الخضار والصوص السوداني الخاص',
      price: '25',
      storeId: 6,
      category: 'مطاعم وكافيهات',
      isActive: true,
      createdAt: new Date(),
    };

    const demoFries: Product = {
      id: 10,
      name: 'بطاطس مقرمشة بالتوابل',
      description: 'بطاطس مقلية مقرمشة متبلة بالتوابل السودانية',
      price: '10',
      storeId: 6,
      category: 'مطاعم وكافيهات',
      isActive: true,
      createdAt: new Date(),
    };

    this.products = [demoProduct, demoMeal, demoPhone, demoLaptop, demoThobe, demoToub, demoCoffee, demoJuice, demoBurger, demoFries];

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

    // Create demo services for electronics store
    const demoRepairService: Service = {
      id: 2,
      name: 'صيانة الهواتف والأجهزة',
      description: 'خدمة صيانة وإصلاح الهواتف الذكية والأجهزة الإلكترونية',
      price: '50',
      storeId: 3,
      category: 'صيانة إلكترونيات',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo service for fashion store
    const demoTailoringService: Service = {
      id: 3,
      name: 'خدمة تفصيل الملابس',
      description: 'تفصيل الجلابيات والملابس السودانية حسب المقاس',
      price: '100',
      storeId: 4,
      category: 'تفصيل ملابس',
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo delivery service for restaurants
    const demoDeliveryService: Service = {
      id: 4,
      name: 'خدمة التوصيل للمنازل',
      description: 'توصيل الطعام والمشروبات لجميع أنحاء الخرطوم',
      price: '5',
      storeId: 5,
      category: 'توصيل طعام',
      isActive: true,
      createdAt: new Date(),
    };

    this.services = [demoService, demoRepairService, demoTailoringService, demoDeliveryService];

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

    // Create demo jobs for electronics store
    const demoTechJob: Job = {
      id: 2,
      title: 'مطلوب فني صيانة إلكترونيات',
      description: 'نبحث عن فني ماهر في صيانة الهواتف والأجهزة الإلكترونية',
      salary: '1200',
      location: 'الخرطوم',
      storeId: 3,
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo job for fashion store
    const demoTailorJob: Job = {
      id: 3,
      title: 'مطلوب خياط محترف',
      description: 'خياط ماهر في تفصيل الملابس السودانية التقليدية والحديثة',
      salary: '1000',
      location: 'الخرطوم',
      storeId: 4,
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo job for cafe
    const demoBaristaJob: Job = {
      id: 4,
      title: 'مطلوب باريستا لكافيه النيل',
      description: 'باريستا محترف لإعداد القهوة والمشروبات في بيئة عمل ممتازة',
      salary: '800',
      location: 'الخرطوم',
      storeId: 5,
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo job for fast food
    const demoChefJob: Job = {
      id: 5,
      title: 'مطلوب طباخ للوجبات السريعة',
      description: 'طباخ ماهر في إعداد البرجر والوجبات السريعة',
      salary: '900',
      location: 'الخرطوم',
      storeId: 6,
      isActive: true,
      createdAt: new Date(),
    };

    this.jobs = [demoJob, demoTechJob, demoTailorJob, demoBaristaJob, demoChefJob];

    // Create demo announcements
    const demoAnnouncement: Announcement = {
      id: 1,
      title: 'عرض خاص للعيد',
      content: 'خصم 30% على جميع المنتجات بمناسبة العيد المبارك',
      storeId: 1,
      isActive: true,
      createdAt: new Date(),
    };

    // Create demo announcements for different stores
    const demoElectronicsAnnouncement: Announcement = {
      id: 2,
      title: 'عرض الجمعة البيضاء - خصم 50%',
      content: 'خصم هائل على جميع الهواتف الذكية والأجهزة الإلكترونية لفترة محدودة',
      storeId: 3,
      isActive: true,
      createdAt: new Date(),
    };

    const demoFashionAnnouncement: Announcement = {
      id: 3,
      title: 'مجموعة الصيف الجديدة',
      content: 'وصلت مجموعة الصيف الجديدة من الأزياء السودانية العصرية والتقليدية',
      storeId: 4,
      isActive: true,
      createdAt: new Date(),
    };

    const demoCafeAnnouncement: Announcement = {
      id: 4,
      title: 'افتتاح فرع جديد على النيل',
      content: 'نعلن عن افتتاح فرعنا الجديد على كورنيش النيل مع إطلالة ساحرة',
      storeId: 5,
      isActive: true,
      createdAt: new Date(),
    };

    const demoFastFoodAnnouncement: Announcement = {
      id: 5,
      title: 'وجبة البرجر المضاعفة',
      content: 'جرب وجبة البرجر المضاعفة الجديدة بقطعتين من اللحم الطازج',
      storeId: 6,
      isActive: true,
      createdAt: new Date(),
    };

    const demoRestaurantAnnouncement: Announcement = {
      id: 6,
      title: 'أطباق رمضان الخاصة',
      content: 'تشكيلة واسعة من الأطباق السودانية التقليدية خصيصاً لشهر رمضان المبارك',
      storeId: 2,
      isActive: true,
      createdAt: new Date(),
    };

    this.announcements = [demoAnnouncement, demoElectronicsAnnouncement, demoFashionAnnouncement, demoCafeAnnouncement, demoFastFoodAnnouncement, demoRestaurantAnnouncement];

    this.nextId = 4; // Start from 4 since we have 3 initial users
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    // For Replit Auth, users have string IDs
    return undefined; // Not implemented in memory storage
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // For Replit Auth, upsert user data - but we redirect to legacy users
    // Find or create a legacy user based on email
    let legacyUser = await this.getUserByEmail(userData.email || '');
    
    if (!legacyUser) {
      // Create new legacy user from Replit data
      legacyUser = await this.createUser({
        username: userData.email?.split('@')[0] || 'user',
        password: 'replit_user', // Default password for Replit users
        email: userData.email || '',
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'مستخدم',
        phone: null,
        role: userData.role || 'customer',
      });
    }
    
    return legacyUser;
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
      role: insertUser.role ?? 'merchant',
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

  private checkDbConnection() {
    if (!db) {
      throw new Error('Database not initialized. Please set DATABASE_URL environment variable.');
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    this.checkDbConnection();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    this.checkDbConnection();
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
    this.checkDbConnection();
    const [user] = await db.select().from(legacyUsers).where(eq(legacyUsers.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    this.checkDbConnection();
    const [user] = await db.select().from(legacyUsers).where(eq(legacyUsers.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    this.checkDbConnection();
    const [user] = await db.select().from(legacyUsers).where(eq(legacyUsers.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    this.checkDbConnection();
    const [user] = await db
      .insert(legacyUsers)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    this.checkDbConnection();
    const [user] = await db
      .update(legacyUsers)
      .set(userData)
      .where(eq(legacyUsers.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    this.checkDbConnection();
    const result = await db.delete(legacyUsers).where(eq(legacyUsers.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    this.checkDbConnection();
    return await db.select().from(legacyUsers);
  }

  // Stores
  async getStore(id: number): Promise<Store | undefined> {
    this.checkDbConnection();
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async getStoresByOwner(ownerId: string): Promise<Store[]> {
    this.checkDbConnection();
    return await db.select().from(stores).where(eq(stores.ownerId, ownerId));
  }

  async getStoresByCategory(category: string): Promise<Store[]> {
    this.checkDbConnection();
    return await db.select().from(stores).where(eq(stores.category, category));
  }

  async getAllStores(): Promise<Store[]> {
    this.checkDbConnection();
    return await db.select().from(stores);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    this.checkDbConnection();
    const [store] = await db
      .insert(stores)
      .values(insertStore)
      .returning();
    return store;
  }

  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    this.checkDbConnection();
    const [store] = await db
      .update(stores)
      .set(storeData)
      .where(eq(stores.id, id))
      .returning();
    return store || undefined;
  }

  async deleteStore(id: number): Promise<boolean> {
    this.checkDbConnection();
    const result = await db.delete(stores).where(eq(stores.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    this.checkDbConnection();
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    this.checkDbConnection();
    return await db.select().from(products).where(eq(products.storeId, storeId));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    this.checkDbConnection();
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getAllProducts(): Promise<Product[]> {
    this.checkDbConnection();
    return await db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    this.checkDbConnection();
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    this.checkDbConnection();
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    this.checkDbConnection();
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    this.checkDbConnection();
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async getServicesByStore(storeId: number): Promise<Service[]> {
    this.checkDbConnection();
    return await db.select().from(services).where(eq(services.storeId, storeId));
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    this.checkDbConnection();
    return await db.select().from(services).where(eq(services.category, category));
  }

  async getAllServices(): Promise<Service[]> {
    this.checkDbConnection();
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
    this.checkDbConnection();
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Jobs
  async getJob(id: number): Promise<Job | undefined> {
    this.checkDbConnection();
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getJobsByStore(storeId: number): Promise<Job[]> {
    this.checkDbConnection();
    return await db.select().from(jobs).where(eq(jobs.storeId, storeId));
  }

  async getAllJobs(): Promise<Job[]> {
    this.checkDbConnection();
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
    this.checkDbConnection();
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Announcements
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    this.checkDbConnection();
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement || undefined;
  }

  async getAnnouncementsByStore(storeId: number): Promise<Announcement[]> {
    this.checkDbConnection();
    return await db.select().from(announcements).where(eq(announcements.storeId, storeId));
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    this.checkDbConnection();
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
    this.checkDbConnection();
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return (result.rowCount || 0) > 0;
  }
}

// Initialize storage based on database availability
// Use DatabaseStorage if DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
