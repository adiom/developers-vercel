import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserByApiKey } from "@/lib/auth"

export async function POST(req: Request) {
  // Проверка API-ключа
  const auth = req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    console.log("No Authorization header or not Bearer")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const apiKey = auth.replace("Bearer ", "").trim()
  const user = await getUserByApiKey(apiKey)
  if (!user) {
    console.log("API key not valid")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
    console.log("Request body:", body)
  } catch (e) {
    console.error("Failed to parse JSON body", e)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { project_id, title, description } = body
  if (!project_id || !title) {
    console.log("Missing project_id or title", { project_id, title })
    return NextResponse.json({ error: "project_id and title are required" }, { status: 400 })
  }

  try {
    const result = await sql`
      INSERT INTO tasks (project_id, title, description)
      VALUES (${project_id}, ${title}, ${description})
      RETURNING id, title, project_id, created_at
    `
    console.log("Task created:", result[0])
    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error("Failed to create task", error, { project_id, title, description })
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
} 