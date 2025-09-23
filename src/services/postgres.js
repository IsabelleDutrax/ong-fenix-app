import { env } from "../config/env.js";
import { Pool } from "pg";

console.log({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  connectionString: env.DB_URL,
  ssl: false,
});

export const pool = new Pool({
  connectionString: env.DB_URL,
});
