import { cookies } from "next/headers"
import { sql } from "./db"
import { redirect } from "next/navigation"

// Get current user
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
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

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  return user
}

// Get user sessions
export async function getUserSessions() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return []
  }

  try {
    const sessions = await sql`
      SELECT s.*, u.id as user_id
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
      ORDER BY s.created_at DESC
    `

    if (sessions.length === 0) {
      return []
    }

    const userSessions = await sql`
      SELECT id, token, ip_address, created_at, expires_at
      FROM sessions 
      WHERE user_id = ${sessions[0].user_id} 
      AND expires_at > NOW()
      ORDER BY created_at DESC
    `

    return userSessions
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return []
  }
}

export async function getSessions(userId: number) {
  return await sql`
    SELECT * FROM sessions 
    WHERE user_id = ${userId} 
    AND expires_at > NOW()
    ORDER BY created_at DESC
  `
} 