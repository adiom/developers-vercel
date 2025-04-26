import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"

export async function UpcomingTasks() {
  let tasks = []
  let error = null

  try {
    // Fetch upcoming tasks that are not completed, ordered by due date
    tasks = await sql`
      SELECT t.id, t.title, t.status, t.due_date, p.name as project_name, u.name as assigned_to
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.status != 'completed'
      ORDER BY 
        CASE 
          WHEN t.due_date IS NULL THEN 1 
          ELSE 0 
        END,
        t.due_date ASC
      LIMIT 5
    `
  } catch (e) {
    console.error("Error fetching upcoming tasks:", e)
    error = "Failed to load upcoming tasks"
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "in progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "blocked":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date"

    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)

    if (dateOnly.getTime() === today.getTime()) {
      return "Today"
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link href="/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4 text-muted-foreground">{error}</div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{task.title}</p>
                  <Badge className={getStatusColor(task.status)} variant="outline">
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">{task.project_name}</p>
                  <p className="text-muted-foreground">Due: {formatDate(task.due_date)}</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/tasks/${task.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No upcoming tasks</p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/tasks/new">Add Your First Task</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
