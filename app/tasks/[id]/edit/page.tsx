import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import TaskEditForm from "@/components/task-edit-form"

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  await requireAuth()

  const taskId = Number.parseInt(params.id)

  if (isNaN(taskId)) {
    notFound()
  }

  // Получаем данные задачи
  const tasks = await sql`
    SELECT t.*, p.name as project_name 
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ${taskId}
  `

  if (tasks.length === 0) {
    notFound()
  }

  const task = tasks[0]

  // Получаем список проектов для выпадающего списка
  const projects = await sql`
    SELECT id, name FROM projects ORDER BY name
  `

  // Получаем список пользователей для назначения
  const users = await sql`
    SELECT id, name FROM users ORDER BY name
  `

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать задачу</h1>
      <TaskEditForm task={task} projects={projects} users={users} />
    </div>
  )
}
