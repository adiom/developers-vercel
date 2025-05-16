import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound, redirect } from "next/navigation"

interface VulnerabilityPageProps {
  params: {
    id: string
  }
}

export default async function VulnerabilityPage({ params }: VulnerabilityPageProps) {
  // Если id равен "new", перенаправляем на страницу создания уязвимости
  const { id } = await params;
  if (id === "new") {
    redirect("/vulnerabilities/new")
  }

  // Получаем ID уязвимости из параметров
  const vulnerabilityId = Number.parseInt(id);

  if (isNaN(vulnerabilityId)) {
    notFound()
  }

  // Получаем данные уязвимости
  const vulnerabilityResult = await sql`
    SELECT v.*, a.assessment_type, a.id as assessment_id, p.name as project_name, p.id as project_id 
    FROM vulnerabilities v
    JOIN assessments a ON v.assessment_id = a.id
    JOIN projects p ON a.project_id = p.id
    WHERE v.id = ${vulnerabilityId}
  `

  if (vulnerabilityResult.length === 0) {
    notFound()
  }

  const vulnerability = vulnerabilityResult[0]

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "closed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "in progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "mitigated":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "open":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vulnerabilities">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Назад</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{vulnerability.title}</h1>
        <Badge className={getSeverityColor(vulnerability.severity)} variant="outline">
          {vulnerability.severity}
        </Badge>
        <Badge className={getStatusColor(vulnerability.status)} variant="outline">
          {vulnerability.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Детали уязвимости</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/vulnerabilities/${vulnerabilityId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Проект</h3>
                  <p>
                    <Link href={`/projects/${vulnerability.project_id}`} className="hover:underline">
                      {vulnerability.project_name}
                    </Link>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Оценка</h3>
                  <p>
                    <Link href={`/assessments/${vulnerability.assessment_id}`} className="hover:underline">
                      {vulnerability.assessment_type}
                    </Link>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Серьезность</h3>
                  <p>{vulnerability.severity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Статус</h3>
                  <p>{vulnerability.status}</p>
                </div>
              </div>

              {vulnerability.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Описание</h3>
                  <p className="mt-1 whitespace-pre-wrap">{vulnerability.description}</p>
                </div>
              )}

              {vulnerability.remediation && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Рекомендации по устранению</h3>
                  <p className="mt-1 whitespace-pre-wrap">{vulnerability.remediation}</p>
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
                <h3 className="text-sm font-medium text-muted-foreground">Создано</h3>
                <p>{new Date(vulnerability.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Последнее обновление</h3>
                <p>{new Date(vulnerability.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Хронология изменений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Создание уязвимости</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(vulnerability.created_at).toLocaleDateString()} •{" "}
                  {new Date(vulnerability.created_at).toLocaleTimeString()}
                </p>
              </div>
              <Badge variant="outline">Создано</Badge>
            </div>
            {vulnerability.created_at.toString() !== vulnerability.updated_at.toString() && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Обновление уязвимости</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(vulnerability.updated_at).toLocaleDateString()} •{" "}
                    {new Date(vulnerability.updated_at).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="outline">Обновлено</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
