import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userSessions = await sql`
      SELECT id, token, ip_address, created_at, expires_at
      FROM sessions 
      WHERE user_id = ${sessions[0].user_id} 
      AND expires_at > NOW()
      ORDER BY created_at DESC
    `

    return NextResponse.json({ sessions: userSessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { token } = await request.json()

    // Проверяем, что пользователь удаляет свой сеанс
    const sessions = await sql`
      SELECT s.*, u.id as user_id
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const targetSession = await sql`
      SELECT * FROM sessions 
      WHERE token = ${token}
      AND user_id = ${sessions[0].user_id}
    `

    if (targetSession.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    await sql`
      DELETE FROM sessions
      WHERE token = ${token}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 