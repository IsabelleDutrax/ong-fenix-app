import { Pool } from "pg";

export const pool = new Pool({
  connectionString: "postgresql://admin:admin123@localhost:5433/ongfenix",
});
