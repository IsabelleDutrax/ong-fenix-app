import { env } from "../config/env.js";
import { Client } from "pg";

console.log({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  connectionString: env.DB_URL,
  ssl: false,
});

const client = new Client({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  connectionString: env.DB_URL,
});
await client.connect();

export { client };
