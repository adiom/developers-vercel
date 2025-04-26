import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, FileText, Download } from "lucide-react"
import { sql } from "@/lib/db"
import { SecurityRiskChart } from "@/components/reports/security-risk-chart"
import { VulnerabilityTrendChart } from "@/components/reports/vulnerability-trend-chart"
import { ProjectStatusChart } from "@/components/reports/project-status-chart"

export default async function ReportsPage() {
  // Получаем статистику для отчетов
  const vulnerabilitiesBySeverity = await sql`
    SELECT severity, COUNT(*) as count
    FROM vulnerabilities
    GROUP BY severity
    ORDER BY 
      CASE 
        WHEN severity = 'Critical' THEN 1
        WHEN severity = 'High' THEN 2
        WHEN severity = 'Medium' THEN 3
        WHEN severity = 'Low' THEN 4
        ELSE 5
      END
  `

  const projectsByStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM projects
    GROUP BY status
    ORDER BY 
      CASE 
        WHEN status = 'pending' THEN 1
        WHEN status = 'in progress' THEN 2
        WHEN status = 'completed' THEN 3
        ELSE 4
      END
  `

  const assessmentsByRiskLevel = await sql`
    SELECT risk_level, COUNT(*) as count
    FROM assessments
    WHERE risk_level IS NOT NULL
    GROUP BY risk_level
    ORDER BY 
      CASE 
        WHEN risk_level = 'Critical' THEN 1
        WHEN risk_level = 'High' THEN 2
        WHEN risk_level = 'Medium' THEN 3
        WHEN risk_level = 'Low' THEN 4
        ELSE 5
      END
  `

  // Получаем список доступных отчетов
  const reports = [
    {
      id: 1,
      title: "Ежемесячный отчет по безопасности",
      description: "Сводка всех оценок безопасности и уязвимостей за последний месяц",
      date: "01.04.2023",
      type: "PDF",
    },
    {
      id: 2,
      title: "Квартальный отчет по соответствию",
      description: "Анализ соответствия требованиям безопасности за последний квартал",
      date: "31.03.2023",
      type: "DOCX",
    },
    {
      id: 3,
      title: "Отчет по уязвимостям Acme Corporation",
      description: "Подробный анализ уязвимостей, обнаруженных в инфраструктуре клиента",
      date: "15.03.2023",
      type: "PDF",
    },
    {
      id: 4,
      title: "Оценка рисков Global Financial",
      description: "Оценка рисков безопасности для финансовых систем клиента",
      date: "28.02.2023",
      type: "XLSX",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Отчеты</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Создать новый отчет
        </Button>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart className="mr-2 h-4 w-4" />
            Панель отчетов
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="mr-2 h-4 w-4" />
            Сохраненные отчеты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Уязвимости по серьезности</CardTitle>
                <CardDescription>Распределение уязвимостей по уровню серьезности</CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityRiskChart data={vulnerabilitiesBySeverity} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статус проектов</CardTitle>
                <CardDescription>Распределение проектов по текущему статусу</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectStatusChart data={projectsByStatus} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Оценки по уровню риска</CardTitle>
                <CardDescription>Распределение оценок безопасности по уровню риска</CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityRiskChart data={assessmentsByRiskLevel} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Тренд уязвимостей</CardTitle>
              <CardDescription>Количество обнаруженных и закрытых уязвимостей по времени</CardDescription>
            </CardHeader>
            <CardContent>
              <VulnerabilityTrendChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Сохраненные отчеты</CardTitle>
              <CardDescription>Список сгенерированных отчетов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Создан: {report.date} • Тип: {report.type}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Скачать
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
