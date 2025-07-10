import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "../shared/schema";

const sqlite = new Database('./database.sqlite');
export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ownerId INTEGER NOT NULL,
    category TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    storeId INTEGER NOT NULL,
    category TEXT NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    storeId INTEGER NOT NULL,
    category TEXT NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    salary TEXT,
    location TEXT,
    storeId INTEGER NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    storeId INTEGER NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id)
  );
`);

console.log('SQLite database initialized successfully');