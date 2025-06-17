import { initDatabase } from "../lib/db"

async function main() {
  console.log("Initializing database...")
  
  try {
    // Initialize all database tables
    await initDatabase()
    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

main()