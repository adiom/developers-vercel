import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { formatDisplayDate } from "@/lib/date"

interface Task {
  id: number
  title: string
  project_name: string
  status: string
  due_date: string | null
  assigned_to_name: string | null
}

export default async function TasksPage() {
  // Fetch only required columns (aliasing t.name as title for UI consistency)
  const tasks = await sql<Task[]>`
    SELECT 
      t.id,
      t.title AS title,
      t.status,
      t.due_date,
      p.name AS project_name,
      u.name AS assigned_to_name
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.due_date ASC NULLS LAST
  `

  const pendingTasks = tasks.filter((task) => task.status.toLowerCase() === "pending")
  const inProgressTasks = tasks.filter((task) => task.status.toLowerCase() === "in progress")
  const completedTasks = tasks.filter((task) => task.status.toLowerCase() === "completed")

  const formatDate = (dateString: string | null) => formatDisplayDate(dateString)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tasks..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-4">
          <TaskList tasks={pendingTasks} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="in-progress" className="pt-4">
          <TaskList tasks={inProgressTasks} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="completed" className="pt-4">
          <TaskList tasks={completedTasks} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <TaskList tasks={tasks} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskList({ tasks, formatDate }: { tasks: Task[]; formatDate: (d: string | null) => string }) {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="There are no tasks in this category." actionHref="/tasks/new" actionLabel="Add Task" />
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left">
          <tr className="border-b">
            <th className="p-3 font-medium w-[30%]">Title</th>
            <th className="p-3 font-medium w-[25%]">Project</th>
            <th className="p-3 font-medium w-[15%]">Status</th>
            <th className="p-3 font-medium w-[20%]">Due Date</th>
            <th className="p-3 font-medium w-[10%] text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = task.due_date ? new Date(task.due_date) < new Date() && task.status.toLowerCase() !== "completed" : false
            return (
              <tr key={task.id} className={overdue ? "bg-red-50/40 dark:bg-red-950/30" : undefined}>
                <td className="p-3 align-top">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {task.assigned_to_name ? `Assigned to: ${task.assigned_to_name}` : "Unassigned"}
                  </div>
                </td>
                <td className="p-3 align-top">{task.project_name}</td>
                <td className="p-3 align-top"><StatusBadge status={task.status} /></td>
                <td className="p-3 align-top">{formatDate(task.due_date)}</td>
                <td className="p-3 align-top text-right">
                  <Button variant="ghost" size="sm" asChild aria-label={`View task ${task.title}`}>
                    <Link href={`/tasks/${task.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
