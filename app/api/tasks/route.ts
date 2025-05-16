import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserByApiKey } from "@/lib/auth"

// Helper function to add CORS headers to the response
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response)
}

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
    return addCorsHeaders(NextResponse.json({ error: "Invalid JSON" }, { status: 400 }))
  }
  const { project_id, title, description } = body
  if (!project_id || !title) {
    console.log("Missing project_id or title", { project_id, title })
    return addCorsHeaders(NextResponse.json({ error: "project_id and title are required" }, { status: 400 }))
  }

  try {
    const result = await sql`
      INSERT INTO tasks (project_id, title, description)
      VALUES (${project_id}, ${title}, ${description})
      RETURNING id, title, project_id, created_at
    `
    console.log("Task created:", result[0])
    return addCorsHeaders(NextResponse.json({ task: result[0] }))
  } catch (error) {
    console.error("Failed to create task", error, { project_id, title, description })
    return addCorsHeaders(NextResponse.json({ error: "Failed to create task" }, { status: 500 }))
  }
} 