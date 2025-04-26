import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectForm } from "@/components/project-form"
import { sql } from "@/lib/db"

export default async function NewProjectPage() {
  // Fetch clients for the dropdown
  const clients = await sql`SELECT id, name FROM clients ORDER BY name ASC`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Project</h1>
        <p className="text-muted-foreground">Create a new security project</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Enter the details of the new project</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
