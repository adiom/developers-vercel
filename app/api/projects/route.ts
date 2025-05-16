import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { z } from "zod"

// Schema for project creation
const createProjectSchema = z.object({
  client_id: z.number(),
  name: z.string().min(1, "Название проекта обязательно"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["pending", "in progress", "completed", "on hold"]).default("pending")
})

export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = createProjectSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      )
    }

    const { client_id, name, description, start_date, end_date, status } = result.data

    // Verify that the client exists and belongs to the user
    const client = await sql`
      SELECT id FROM clients 
      WHERE id = ${client_id} 
      AND user_id = ${userId}
    `

    if (client.length === 0) {
      return NextResponse.json(
        { error: "Client not found or access denied" },
        { status: 404 }
      )
    }

    // Create the project
    const project = await sql`
      INSERT INTO projects (
        client_id,
        name,
        description,
        start_date,
        end_date,
        status,
        created_by
      )
      VALUES (
        ${client_id},
        ${name},
        ${description || null},
        ${start_date || null},
        ${end_date || null},
        ${status},
        ${userId}
      )
      RETURNING id, name, description, start_date, end_date, status, created_at
    `

    return NextResponse.json(project[0])
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 