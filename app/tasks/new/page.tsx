import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskForm } from "@/components/task-form"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"

interface NewTaskPageProps {
  searchParams: {
    project?: string
  }
}

export default async function NewTaskPage({ searchParams }: NewTaskPageProps) {
  // Fetch projects for the dropdown
  const projects = await sql`SELECT id, name FROM projects ORDER BY name ASC`

  // Fetch users for the assignee dropdown
  const users = await sql`SELECT id, name FROM users ORDER BY name ASC`

  // Get default project ID from URL params
  const resolvedSearchParams = await searchParams
  const defaultProjectId = resolvedSearchParams.project ? parseInt(resolvedSearchParams.project) : undefined

  // If no projects exist, redirect to create a project first
  if (projects.length === 0) {
    redirect("/projects/new?redirect=tasks/new")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Создать новую задачу</h1>
        <p className="text-muted-foreground">Создайте новую задачу для проекта безопасности</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о задаче</CardTitle>
          <CardDescription>Введите детали новой задачи</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm projects={projects} users={users} defaultProjectId={defaultProjectId} />
        </CardContent>
      </Card>
    </div>
  )
}
