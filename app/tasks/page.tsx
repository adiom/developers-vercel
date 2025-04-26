import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function TasksPage() {
  // Fetch tasks from the database with project and assignee names
  const tasks = await sql`
    SELECT t.*, p.name as project_name, u.name as assigned_to_name 
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.due_date ASC NULLS LAST
  `

  const pendingTasks = tasks.filter((task) => task.status.toLowerCase() === "pending")
  const inProgressTasks = tasks.filter((task) => task.status.toLowerCase() === "in progress")
  const completedTasks = tasks.filter((task) => task.status.toLowerCase() === "completed")

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
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

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
          <TaskList tasks={pendingTasks} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="in-progress" className="pt-4">
          <TaskList tasks={inProgressTasks} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="completed" className="pt-4">
          <TaskList tasks={completedTasks} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <TaskList tasks={tasks} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskList({ tasks, getStatusColor, formatDate }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">There are no tasks in this category.</p>
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-1"></div>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
          <div className="col-span-4">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-muted-foreground">
              {task.assigned_to_name ? `Assigned to: ${task.assigned_to_name}` : "Unassigned"}
            </div>
          </div>
          <div className="col-span-3">{task.project_name}</div>
          <div className="col-span-2">
            <Badge className={getStatusColor(task.status)} variant="outline">
              {task.status}
            </Badge>
          </div>
          <div className="col-span-2">{formatDate(task.due_date)}</div>
          <div className="col-span-1 text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/tasks/${task.id}`}>View</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
