import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectEditForm } from "@/components/project-edit-form"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Получаем ID проекта из параметров
  const { id } = await params;
  const projectId = Number.parseInt(id);

  if (isNaN(projectId)) {
    notFound()
  }

  // Получаем данные проекта
  const projectResult = await sql`SELECT * FROM projects WHERE id = ${projectId}`

  if (projectResult.length === 0) {
    notFound()
  }

  const project = projectResult[0]

  // Получаем список клиентов для выпадающего списка
  const clients = await sql`SELECT id, name FROM clients ORDER BY name ASC`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редактирование проекта</h1>
        <p className="text-muted-foreground">Обновите информацию о проекте</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о проекте</CardTitle>
          <CardDescription>Внесите необходимые изменения</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectEditForm project={project} clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
