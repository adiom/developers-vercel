import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import DeleteTeamMember from "@/components/team/delete-team-member"

interface TeamMemberPageProps {
  params: {
    id: string
  }
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  // Получаем ID сотрудника из параметров
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

  // Получаем задачи, назначенные сотруднику
  const tasks = await sql`
    SELECT t.*, p.name as project_name 
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.assigned_to = ${userId}
    ORDER BY t.due_date ASC NULLS LAST
    LIMIT 5
  `

  // Получаем оценки безопасности, проведенные сотрудником
  const assessments = await sql`
    SELECT a.*, p.name as project_name 
    FROM assessments a
    JOIN projects p ON a.project_id = p.id
    WHERE a.conducted_by = ${userId}
    ORDER BY a.assessment_date DESC NULLS LAST
    LIMIT 5
  `

  // Получаем инициалы для аватара
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Получаем цвет бейджа для роли
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "manager":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Назад</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <Badge className={getRoleBadgeColor(user.role)} variant="outline">
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Профиль сотрудника</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/team/${userId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Активные задачи</h3>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status !== "completed").length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Проведенные оценки</h3>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Дата регистрации</h3>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div className="pt-4">
                <DeleteTeamMember userId={userId} userName={user.name} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Текущие задачи</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Проект: {task.project_name} • Статус: {task.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/tasks/${task.id}`}>Просмотр</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Нет активных задач</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Проведенные оценки безопасности</CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{assessment.assessment_type}</h3>
                    <p className="text-sm text-muted-foreground">
                      Проект: {assessment.project_name} • Дата:{" "}
                      {assessment.assessment_date
                        ? new Date(assessment.assessment_date).toLocaleDateString()
                        : "Не указана"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/assessments/${assessment.id}`}>Просмотр</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Нет проведенных оценок</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
