import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import TeamMemberEditForm from "@/components/team/team-member-edit-form"

interface TeamMemberEditPageProps {
  params: {
    id: string
  }
}

export default async function TeamMemberEditPage({ params }: TeamMemberEditPageProps) {
  const userId = Number.parseInt(params.id)

  if (isNaN(userId)) {
    notFound()
  }

  // Получаем данные сотрудника
  const userResult = await sql`SELECT * FROM users WHERE id = ${userId}`

  if (userResult.length === 0) {
    notFound()
  }

  const user = userResult[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/team/${userId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Назад</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Редактирование профиля</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о сотруднике</CardTitle>
          <CardDescription>
            Обновите информацию о сотруднике и нажмите "Сохранить", чтобы применить изменения.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMemberEditForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
