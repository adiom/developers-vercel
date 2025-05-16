"use server"

import { sql } from "./db"
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

export async function updateClient(data: {
  id: number
  name: string
  industry?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
}) {
  try {
    await sql`
      UPDATE clients 
      SET 
        name = ${data.name}, 
        industry = ${data.industry || null}, 
        contact_person = ${data.contact_person || null}, 
        email = ${data.email || null}, 
        phone = ${data.phone || null}, 
        address = ${data.address || null},
        updated_at = NOW()
      WHERE id = ${data.id}
    `

    revalidatePath("/clients")
    revalidatePath(`/clients/${data.id}`)
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to update client" }
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

export async function updateProject(data: {
  id: number
  client_id: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: string
}) {
  try {
    await sql`
      UPDATE projects 
      SET 
        client_id = ${data.client_id}, 
        name = ${data.name}, 
        description = ${data.description || null}, 
        start_date = ${data.start_date || null}, 
        end_date = ${data.end_date || null}, 
        status = ${data.status || "pending"},
        updated_at = NOW()
      WHERE id = ${data.id}
    `

    revalidatePath("/projects")
    revalidatePath(`/projects/${data.id}`)
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to update project" }
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

export async function updateTask(taskData: {
  id: number
  title: string
  description: string
  status: string
  due_date: string
  project_id: number | null
  assigned_to: number | null
}) {
  try {
    const { id, title, description, status, due_date, project_id, assigned_to } = taskData

    await sql`
      UPDATE tasks
      SET 
        title = ${title},
        description = ${description},
        status = ${status},
        due_date = ${due_date ? new Date(due_date) : null},
        project_id = ${project_id},
        assigned_to = ${assigned_to},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error)
    return { success: false, error: "Не удалось обновить задачу" }
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

export async function updateAssessment(data: {
  id: number
  project_id: number
  assessment_type: string
  status?: string
  findings?: string
  risk_level?: string
  conducted_by?: number
  assessment_date?: string
}) {
  try {
    await sql`
      UPDATE assessments 
      SET 
        project_id = ${data.project_id}, 
        assessment_type = ${data.assessment_type}, 
        status = ${data.status || "pending"}, 
        findings = ${data.findings || null}, 
        risk_level = ${data.risk_level || null}, 
        conducted_by = ${data.conducted_by || null}, 
        assessment_date = ${data.assessment_date || null},
        updated_at = NOW()
      WHERE id = ${data.id}
    `

    revalidatePath("/assessments")
    revalidatePath(`/assessments/${data.id}`)
    revalidatePath(`/projects/${data.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to update assessment" }
  }
}

export async function createVulnerability(data: {
  assessment_id: number
  title: string
  description?: string
  severity: string
  status?: string
  remediation?: string
}) {
  try {
    const result = await sql`
      INSERT INTO vulnerabilities (assessment_id, title, description, severity, status, remediation)
      VALUES (${data.assessment_id}, ${data.title}, ${data.description || null}, ${data.severity}, ${data.status || "open"}, ${data.remediation || null})
      RETURNING id
    `

    // Get the project_id for the assessment to revalidate the project page
    const assessmentResult = await sql`
      SELECT project_id FROM assessments WHERE id = ${data.assessment_id}
    `

    const projectId = assessmentResult[0]?.project_id

    revalidatePath("/vulnerabilities")
    revalidatePath(`/assessments/${data.assessment_id}`)
    if (projectId) {
      revalidatePath(`/projects/${projectId}`)
    }

    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to create vulnerability" }
  }
}

export async function updateVulnerability(data: {
  id: number
  assessment_id: number
  title: string
  description?: string
  severity: string
  status?: string
  remediation?: string
}) {
  try {
    await sql`
      UPDATE vulnerabilities 
      SET 
        assessment_id = ${data.assessment_id}, 
        title = ${data.title}, 
        description = ${data.description || null}, 
        severity = ${data.severity}, 
        status = ${data.status || "open"}, 
        remediation = ${data.remediation || null},
        updated_at = NOW()
      WHERE id = ${data.id}
    `

    // Get the project_id for the assessment to revalidate the project page
    const assessmentResult = await sql`
      SELECT project_id FROM assessments WHERE id = ${data.assessment_id}
    `

    const projectId = assessmentResult[0]?.project_id

    revalidatePath("/vulnerabilities")
    revalidatePath(`/vulnerabilities/${data.id}`)
    revalidatePath(`/assessments/${data.assessment_id}`)
    if (projectId) {
      revalidatePath(`/projects/${projectId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to update vulnerability" }
  }
}
