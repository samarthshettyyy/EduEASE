import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import { migrate } from "drizzle-orm/mysql2/migrator"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function main() {
  console.log("Starting database migration...")

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "eduease_db",
    multipleStatements: true,
  })

  const db = drizzle(connection)

  // Run migrations
  await migrate(db, { migrationsFolder: "db/migrations" })

  console.log("Migration completed successfully!")
  await connection.end()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})