import { neon } from "@neondatabase/serverless"

let client: ReturnType<typeof neon> | undefined
function getClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL environment variable is not set")
  client ??= neon(connectionString)
  return client
}

// Keep public routes importable during builds; connect only when a query runs.
const unconfiguredClient = neon("postgres://placeholder:placeholder@localhost/canfly")
const sql = new Proxy(unconfiguredClient, {
  apply(_target, _thisArg, args) {
    const activeClient = getClient()
    return Reflect.apply(activeClient, activeClient, args)
  },
  get(_target, property) {
    const activeClient = getClient()
    const value = Reflect.get(activeClient, property, activeClient)
    return typeof value === "function" ? value.bind(activeClient) : value
  },
})

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL)

// Initialize database tables
async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create clients table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status TEXT NOT NULL DEFAULT 'pending',
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create tasks table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        ip_address TEXT,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create api_keys table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(key_hash)
      )
    `

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database tables:", error)
    throw error
  }
}

export { sql, initDatabase }
