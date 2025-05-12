import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AssessmentEditForm } from "@/components/assessment-edit-form"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

interface EditAssessmentPageProps {
  params: {
    id: string
  }
}

export default async function EditAssessmentPage({ params }: EditAssessmentPageProps) {
  // Получаем ID оценки из параметров
  const assessmentId = Number.parseInt(params.id)

  if (isNaN(assessmentId)) {
    notFound()
  }

  // Получаем данные оценки
  const assessmentResult = await sql`SELECT * FROM assessments WHERE id = ${assessmentId}`

  if (assessmentResult.length === 0) {
    notFound()
  }

  const assessment = assessmentResult[0]

  // Получаем список проектов для выпадающего списка
  const projects = await sql`SELECT id, name FROM projects ORDER BY name ASC`

  // Получаем список пользователей для выпадающего списка
  const users = await sql`SELECT id, name FROM users ORDER BY name ASC`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редактирование оценки безопасности</h1>
        <p className="text-muted-foreground">Обновите информацию об оценке безопасности</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация об оценке</CardTitle>
          <CardDescription>Внесите необходимые изменения</CardDescription>
        </CardHeader>
        <CardContent>
          <AssessmentEditForm assessment={assessment} projects={projects} users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
