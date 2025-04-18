import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql", // This was missing
  // This needs to be changed to match supported drivers
  dbCredentials: {
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "23883529",
    database: process.env.DATABASE_NAME || "eduease_db",
  },
} satisfies Config;