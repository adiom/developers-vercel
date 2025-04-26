import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { DeleteProjectButton } from "@/components/delete-project-button"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // If the id is "new", redirect to the project creation page
  if (params.id === "new") {
    redirect("/projects/new")
  }

  // Parse the project ID and ensure it's a valid number
  const projectId = Number.parseInt(params.id)

  if (isNaN(projectId)) {
    notFound()
  }

  // Fetch project details
  const projectResult = await sql`
    SELECT p.*, c.name as client_name 
    FROM projects p
    JOIN clients c ON p.client_id = c.id
    WHERE p.id = ${projectId}
  `

  if (projectResult.length === 0) {
    notFound()
  }

  const project = projectResult[0]

  // Fetch tasks for this project
  const tasks = await sql`
    SELECT t.*, u.name as assigned_to_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ${projectId}
    ORDER BY t.due_date ASC NULLS LAST
  `

  // Fetch assessments for this project
  const assessments = await sql`
    SELECT a.*, u.name as conducted_by_name
    FROM assessments a
    LEFT JOIN users u ON a.conducted_by = u.id
    WHERE a.project_id = ${projectId}
    ORDER BY a.assessment_date DESC NULLS LAST
  `

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "in progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "on hold":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Badge className={getStatusColor(project.status)} variant="outline">
          {project.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Information about the project</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${projectId}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DeleteProjectButton projectId={projectId} projectName={project.name} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                  <p>{project.client_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{project.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p>{formatDate(project.start_date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p>{formatDate(project.end_date)}</p>
                </div>
              </div>

              {project.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1">{project.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tasks</h3>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assessments</h3>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="assessments">Security Assessments</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button size="sm" asChild>
              <Link href={`/tasks/new?project=${projectId}`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>

          {tasks.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Assigned To</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-1"></div>
              </div>
              {tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
                  <div className="col-span-5">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {task.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">{task.assigned_to_name || "Unassigned"}</div>
                  <div className="col-span-2">{formatDate(task.due_date)}</div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tasks/${task.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven't added any tasks to this project yet.
                </p>
                <Button asChild>
                  <Link href={`/tasks/new?project=${projectId}`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Security Assessments</h2>
            <Button size="sm" asChild>
              <Link href={`/assessments/new?project=${projectId}`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Assessment
              </Link>
            </Button>
          </div>

          {assessments.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                <div className="col-span-3">Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Risk Level</div>
                <div className="col-span-2">Conducted By</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1"></div>
              </div>
              {assessments.map((assessment) => (
                <div key={assessment.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
                  <div className="col-span-3 font-medium">{assessment.assessment_type}</div>
                  <div className="col-span-2">
                    <Badge className={getStatusColor(assessment.status)} variant="outline">
                      {assessment.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">{assessment.risk_level || "Not assessed"}</div>
                  <div className="col-span-2">{assessment.conducted_by_name || "Not assigned"}</div>
                  <div className="col-span-2">{formatDate(assessment.assessment_date)}</div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/assessments/${assessment.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No assessments found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven't added any security assessments to this project yet.
                </p>
                <Button asChild>
                  <Link href={`/assessments/new?project=${projectId}`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Assessment
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
