import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import crypto from "crypto"
import { sql } from "./db"

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex")

    // Hash the password with the salt using PBKDF2
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      // Store both the salt and the hash
      resolve(`${salt}:${derivedKey.toString("hex")}`)
    })
  })
}

// Password verification
export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Split the stored password into salt and hash
    const [salt, storedHash] = storedPassword.split(":")

    // Hash the supplied password with the same salt
    crypto.pbkdf2(suppliedPassword, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      // Compare the hashes
      resolve(storedHash === derivedKey.toString("hex"))
    })
  })
}

// Session management
export function setAuthCookie(userId: number) {
  // Create a session token
  const sessionToken = crypto.randomBytes(32).toString("hex")

  // Set the cookie (secure in production)
  cookies().set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Store the session in the database
  return sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${sessionToken}, NOW() + INTERVAL '7 days')
  `
}

export function clearAuthCookie() {
  const sessionToken = cookies().get("session_token")?.value

  // Delete the session from the database if it exists
  if (sessionToken) {
    sql`DELETE FROM sessions WHERE token = ${sessionToken}`
  }

  // Clear the cookie
  cookies().delete("session_token")
}

// Get the current user from the session
export async function getCurrentUser() {
  const sessionToken = cookies().get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    // Get the user from the session
    const sessions = await sql`
      SELECT s.user_id, u.email, u.name, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0) {
      return null
    }

    return sessions[0]
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Middleware to protect routes
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

// Middleware to check if user is admin
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/auth/login")
  }

  return user
}
