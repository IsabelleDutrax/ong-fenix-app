import { Pool } from "pg";
import { Client } from "pg";
console.log({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionString: process.env.DB_URL,
  ssl: false,
});
const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionString: process.env.DB_URL,
  ssl: false,
});
await client.connect();

export { client };
