import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL is available
let pool: Pool | null = null;
let db: any | null = null;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Database operations will use in-memory storage.");
} else {
  console.log("DATABASE_URL found. Initializing PostgreSQL connection...");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };