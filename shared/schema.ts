import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // user, store_owner, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Legacy users table for existing system
export const legacyUsers = pgTable("legacy_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("user"), // user, store_owner, admin
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});


// Stores table
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  category: text("category").notNull(), // marketplace, services, jobs, announcements
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  location: text("location"),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, { fields: [stores.ownerId], references: [users.id] }),
  products: many(products),
  services: many(services),
  jobs: many(jobs),
  announcements: many(announcements),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  store: one(stores, { fields: [services.storeId], references: [stores.id] }),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  store: one(stores, { fields: [jobs.storeId], references: [stores.id] }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  store: one(stores, { fields: [announcements.storeId], references: [stores.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(legacyUsers).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  description: true,
  ownerId: true,
  category: true,
  address: true,
  phone: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  storeId: true,
  category: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  storeId: true,
  category: true,
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  salary: true,
  location: true,
  storeId: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  storeId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof legacyUsers.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
