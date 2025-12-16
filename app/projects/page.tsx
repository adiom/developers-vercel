import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { formatDisplayDate } from "@/lib/date"

interface Project {
  id: number
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  client_name: string
}

export default async function ProjectsPage() {
  // Fetch only required columns
  const projects = await sql<Project[]>`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.start_date,
      p.end_date,
      p.status,
      c.name AS client_name
    FROM projects p
    JOIN clients c ON p.client_id = c.id
    ORDER BY p.created_at DESC
  `

  const formatDate = (dateString: string | null) => formatDisplayDate(dateString)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => {
            const overdue = project.end_date ? new Date(project.end_date) < new Date() && project.status.toLowerCase() !== "completed" : false
            return (
              <Card key={project.id} className={overdue ? "overflow-hidden ring-1 ring-red-500/30" : "overflow-hidden"}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="truncate" title={project.name}>{project.name}</CardTitle>
                      <CardDescription className="truncate" title={project.client_name}>{project.client_name}</CardDescription>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {project.description && (
                      <p className="text-muted-foreground line-clamp-3" title={project.description}>{project.description}</p>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start:</span>
                      <span>{formatDate(project.start_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End:</span>
                      <span>{formatDate(project.end_date)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button size="sm" variant="outline" asChild aria-label={`View project ${project.name}`}>
                      <Link href={`/projects/${project.id}`}>Details</Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild aria-label={`Edit project ${project.name}`}>
                      <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <EmptyState 
            title="No projects found" 
            description="You haven't added any projects yet. Add one to get started." 
            actionHref="/projects/new" 
            actionLabel="Add Project" 
          />
        )}
      </div>
    </div>
  )
}
