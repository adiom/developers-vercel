import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VulnerabilityEditForm } from "@/components/vulnerability-edit-form"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

interface EditVulnerabilityPageProps {
  params: {
    id: string
  }
}

export default async function EditVulnerabilityPage({ params }: EditVulnerabilityPageProps) {
  // Получаем ID уязвимости из параметров
  const { id } = await params;
  const vulnerabilityId = Number.parseInt(id);

  if (isNaN(vulnerabilityId)) {
    notFound()
  }

  // Получаем данные уязвимости
  const vulnerabilityResult = await sql`SELECT * FROM vulnerabilities WHERE id = ${vulnerabilityId}`

  if (vulnerabilityResult.length === 0) {
    notFound()
  }

  const vulnerability = vulnerabilityResult[0]

  // Получаем список оценок для выпадающего списка
  const assessments = await sql`
    SELECT a.id, a.assessment_type, p.name as project_name
    FROM assessments a
    JOIN projects p ON a.project_id = p.id
    ORDER BY a.created_at DESC
  `

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редактирование уязвимости</h1>
        <p className="text-muted-foreground">Обновите информацию об уязвимости</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация об уязвимости</CardTitle>
          <CardDescription>Внесите необходимые изменения</CardDescription>
        </CardHeader>
        <CardContent>
          <VulnerabilityEditForm vulnerability={vulnerability} assessments={assessments} />
        </CardContent>
      </Card>
    </div>
  )
}
