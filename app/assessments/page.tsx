import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AssessmentsPage() {
  // Получаем оценки безопасности из базы данных с информацией о проекте
  const assessments = await sql`
    SELECT a.*, p.name as project_name, u.name as conducted_by_name 
    FROM assessments a
    JOIN projects p ON a.project_id = p.id
    LEFT JOIN users u ON a.conducted_by = u.id
    ORDER BY a.created_at DESC
  `

  const pendingAssessments = assessments.filter((assessment) => assessment.status.toLowerCase() === "pending")
  const inProgressAssessments = assessments.filter((assessment) => assessment.status.toLowerCase() === "in progress")
  const completedAssessments = assessments.filter((assessment) => assessment.status.toLowerCase() === "completed")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "in progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Не указано"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Оценки безопасности</h1>
        <Button asChild>
          <Link href="/assessments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить оценку
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск оценок..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="pending">Ожидающие ({pendingAssessments.length})</TabsTrigger>
          <TabsTrigger value="in-progress">В процессе ({inProgressAssessments.length})</TabsTrigger>
          <TabsTrigger value="completed">Завершенные ({completedAssessments.length})</TabsTrigger>
          <TabsTrigger value="all">Все ({assessments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-4">
          <AssessmentList
            assessments={pendingAssessments}
            getStatusColor={getStatusColor}
            getRiskLevelColor={getRiskLevelColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="in-progress" className="pt-4">
          <AssessmentList
            assessments={inProgressAssessments}
            getStatusColor={getStatusColor}
            getRiskLevelColor={getRiskLevelColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="completed" className="pt-4">
          <AssessmentList
            assessments={completedAssessments}
            getStatusColor={getStatusColor}
            getRiskLevelColor={getRiskLevelColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <AssessmentList
            assessments={assessments}
            getStatusColor={getStatusColor}
            getRiskLevelColor={getRiskLevelColor}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssessmentList({ assessments, getStatusColor, getRiskLevelColor, formatDate }) {
  if (assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Оценки не найдены</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">В этой категории нет оценок безопасности.</p>
          <Button asChild>
            <Link href="/assessments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить оценку
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-3">Тип оценки</div>
        <div className="col-span-3">Проект</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-2">Уровень риска</div>
        <div className="col-span-1">Дата</div>
        <div className="col-span-1"></div>
      </div>
      {assessments.map((assessment) => (
        <div key={assessment.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
          <div className="col-span-3 font-medium">{assessment.assessment_type}</div>
          <div className="col-span-3">{assessment.project_name}</div>
          <div className="col-span-2">
            <Badge className={getStatusColor(assessment.status)} variant="outline">
              {assessment.status}
            </Badge>
          </div>
          <div className="col-span-2">
            {assessment.risk_level ? (
              <Badge className={getRiskLevelColor(assessment.risk_level)} variant="outline">
                {assessment.risk_level}
              </Badge>
            ) : (
              <span className="text-muted-foreground">Не оценено</span>
            )}
          </div>
          <div className="col-span-1">{formatDate(assessment.assessment_date)}</div>
          <div className="col-span-1 text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/assessments/${assessment.id}`}>Просмотр</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
