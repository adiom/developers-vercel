import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { getClientById } from "@/lib/api"

interface ClientPageProps {
  params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const resolvedParams = await params
  
  // If the id is "new", redirect to the client creation page
  if (resolvedParams.id === "new") {
    redirect("/clients/new")
  }

  // Parse the client ID and ensure it's a valid number
  const clientId = Number.parseInt(resolvedParams.id)

  if (isNaN(clientId)) {
    notFound()
  }

  // Fetch the client data
  const client = await getClientById(clientId)

  if (!client) {
    notFound()
  }

  // Fetch projects for this client
  const projects = await sql`
    SELECT * FROM projects 
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
  `

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{client.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Client Details</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients/${clientId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Client
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                  <p>{client.industry || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Person</h3>
                  <p>{client.contact_person || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{client.email || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{client.phone || "Not specified"}</p>
                </div>
              </div>

              {client.address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="mt-1">{client.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{new Date(client.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{new Date(client.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" asChild>
            <Link href={`/projects/new?client=${clientId}`}>Add Project</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {project.status}
                      {project.start_date && ` • Started: ${new Date(project.start_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No projects found for this client</p>
              <Button size="sm" className="mt-2" asChild>
                <Link href={`/projects/new?client=${clientId}`}>Add First Project</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
