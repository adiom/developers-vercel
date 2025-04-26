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

  // If no projects exist, redirect to create a project first
  if (projects.length === 0) {
    redirect("/projects/new?redirect=tasks/new")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Task</h1>
        <p className="text-muted-foreground">Create a new task for a security project</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
          <CardDescription>Enter the details of the new task</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm projects={projects} users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
