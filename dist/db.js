import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../dist/schema.js";
import "dotenv/config";
const pool = new Pool({ connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
export const db = drizzle(pool, { schema });
