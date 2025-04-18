import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create the connection
const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "MITVATSAM",
  database: process.env.DATABASE_NAME || "eduease_db",
});

// Create the Drizzle instance
export const db = drizzle(connection, { schema, mode: "default" });