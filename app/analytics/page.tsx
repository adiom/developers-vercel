import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { sql } from "@/lib/db"
import { SecurityMetricsChart } from "@/components/analytics/security-metrics-chart"
import { ClientDistributionChart } from "@/components/analytics/client-distribution-chart"
import { ProjectCompletionChart } from "@/components/analytics/project-completion-chart"

export default async function AnalyticsPage() {
  // Получаем данные для аналитики
  const clientsByIndustry = await sql`
    SELECT industry, COUNT(*) as count
    FROM clients
    WHERE industry IS NOT NULL
    GROUP BY industry
    ORDER BY count DESC
  `

  const projectCompletionData = await sql`
    SELECT 
      date_trunc('month', start_date) as month,
      COUNT(*) as total_projects,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects
    FROM projects
    WHERE start_date IS NOT NULL
    GROUP BY date_trunc('month', start_date)
    ORDER BY month
  `

  // Преобразуем данные для графиков
  const industryData = clientsByIndustry.map((item) => ({
    name: item.industry || "Не указано",
    value: Number(item.count),
  }))

  const completionData = projectCompletionData.map((item) => ({
    month: new Date(item.month).toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
    всего: Number(item.total_projects),
    завершено: Number(item.completed_projects),
  }))

  // Метрики безопасности (пример данных)
  const securityMetrics = [
    { month: "Янв", mttr: 8.2, vulnerabilities: 24, compliance: 76 },
    { month: "Фев", mttr: 7.5, vulnerabilities: 31, compliance: 78 },
    { month: "Мар", mttr: 6.8, vulnerabilities: 28, compliance: 82 },
    { month: "Апр", mttr: 5.9, vulnerabilities: 35, compliance: 85 },
    { month: "Май", mttr: 5.2, vulnerabilities: 29, compliance: 88 },
    { month: "Июн", mttr: 4.8, vulnerabilities: 26, compliance: 92 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <p className="text-muted-foreground">Анализ данных безопасности и производительности</p>
      </div>

      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">
            <LineChart className="mr-2 h-4 w-4" />
            Метрики безопасности
          </TabsTrigger>
          <TabsTrigger value="clients">
            <PieChart className="mr-2 h-4 w-4" />
            Распределение клиентов
          </TabsTrigger>
          <TabsTrigger value="projects">
            <BarChart className="mr-2 h-4 w-4" />
            Выполнение проектов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ключевые метрики безопасности</CardTitle>
              <CardDescription>Тренды основных показателей безопасности по месяцам</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityMetricsChart data={securityMetrics} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Среднее время устранения (дни)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">↓ 12% по сравнению с прошлым месяцем</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Открытые уязвимости</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26</div>
                <p className="text-xs text-muted-foreground">↓ 10% по сравнению с прошлым месяцем</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Соответствие требованиям (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">↑ 4% по сравнению с прошлым месяцем</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение клиентов по отраслям</CardTitle>
              <CardDescription>Анализ клиентской базы по секторам экономики</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientDistributionChart data={industryData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Выполнение проектов по месяцам</CardTitle>
              <CardDescription>Соотношение запущенных и завершенных проектов</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectCompletionChart data={completionData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
