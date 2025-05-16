import { config } from 'dotenv';
config();

export default {
  schema: "./dist/schema.js",  // make sure this file exports your schema correctly
  out: "./drizzle",                 // folder to create migration files
  dialect:"postgresql",                 // use "pg" for Postgres/Neon
  dbCredentials: {
   url: process.env.DATABASE_URL ,
    ssl:{rejectUnauthorized:false} // NeonDB connection string stored in .env
  }
};