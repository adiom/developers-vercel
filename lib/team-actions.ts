"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"

export async function inviteTeamMember(data: {
  name: string
  email: string
  role: string
  message?: string
}) {
  try {
    // В реальном приложении здесь будет отправка приглашения по email
    // Для демонстрации просто создаем нового пользователя
    const result = await sql`
      INSERT INTO users (name, email, role)
      VALUES (${data.name}, ${data.email}, ${data.role})
      RETURNING id
    `

    revalidatePath("/team")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Не удалось создать пользователя" }
  }
}

export async function updateTeamMember(data: {
  id: number
  name: string
  email: string
  role: string
  phone?: string
}) {
  try {
    await sql`
      UPDATE users 
      SET 
        name = ${data.name}, 
        email = ${data.email}, 
        role = ${data.role}, 
        phone = ${data.phone || null},
        updated_at = NOW()
      WHERE id = ${data.id}
    `

    revalidatePath("/team")
    revalidatePath(`/team/${data.id}`)
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Не удалось обновить информацию о пользователе" }
  }
}

export async function deleteTeamMember(userId: number) {
  try {
    // Проверяем, есть ли связанные задачи
    const tasksResult = await sql`SELECT COUNT(*) FROM tasks WHERE assigned_to = ${userId}`
    const taskCount = Number.parseInt(tasksResult[0].count)

    if (taskCount > 0) {
      return {
        success: false,
        error: "Невозможно удалить сотрудника, так как у него есть назначенные задачи",
      }
    }

    // Проверяем, есть ли связанные оценки
    const assessmentsResult = await sql`SELECT COUNT(*) FROM assessments WHERE conducted_by = ${userId}`
    const assessmentCount = Number.parseInt(assessmentsResult[0].count)

    if (assessmentCount > 0) {
      return {
        success: false,
        error: "Невозможно удалить сотрудника, так как он проводил оценки безопасности",
      }
    }

    // Если нет связанных записей, удаляем пользователя
    await sql`DELETE FROM users WHERE id = ${userId}`

    revalidatePath("/team")
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Не удалось удалить пользователя" }
  }
}
