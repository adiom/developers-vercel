"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createClient(data: {
  name: string
  industry?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
}) {
  try {
    const result = await sql`
      INSERT INTO clients (name, industry, contact_person, email, phone, address)
      VALUES (${data.name}, ${data.industry || null}, ${data.contact_person || null}, ${data.email || null}, ${data.phone || null}, ${data.address || null})
      RETURNING id
    `

    revalidatePath("/clients")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to create client" }
  }
}

export async function createProject(data: {
  client_id: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: string
}) {
  try {
    const result = await sql`
      INSERT INTO projects (client_id, name, description, start_date, end_date, status)
      VALUES (${data.client_id}, ${data.name}, ${data.description || null}, ${data.start_date || null}, ${data.end_date || null}, ${data.status || "pending"})
      RETURNING id
    `

    revalidatePath("/projects")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function deleteProject(projectId: number) {
  try {
    // Delete the project (cascade will handle related records)
    await sql`DELETE FROM projects WHERE id = ${projectId}`

    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function createTask(data: {
  project_id: number
  title: string
  description?: string
  assigned_to?: number
  due_date?: string
  status?: string
}) {
  try {
    const result = await sql`
      INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status)
      VALUES (${data.project_id}, ${data.title}, ${data.description || null}, ${data.assigned_to || null}, ${data.due_date || null}, ${data.status || "pending"})
      RETURNING id
    `

    revalidatePath("/tasks")
    revalidatePath(`/projects/${data.project_id}`)
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function createAssessment(data: {
  project_id: number
  assessment_type: string
  status?: string
  findings?: string
  risk_level?: string
  conducted_by?: number
  assessment_date?: string
}) {
  try {
    const result = await sql`
      INSERT INTO assessments (project_id, assessment_type, status, findings, risk_level, conducted_by, assessment_date)
      VALUES (${data.project_id}, ${data.assessment_type}, ${data.status || "pending"}, ${data.findings || null}, ${data.risk_level || null}, ${data.conducted_by || null}, ${data.assessment_date || null})
      RETURNING id
    `

    revalidatePath("/assessments")
    revalidatePath(`/projects/${data.project_id}`)
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to create assessment" }
  }
}
