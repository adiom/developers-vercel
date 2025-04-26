import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Folder, ShieldAlert, CheckSquare } from "lucide-react"
import { sql } from "@/lib/db"

export async function DashboardStats() {
  const stats = [
    {
      title: "Всего клиентов",
      value: "0",
      icon: Building2,
      description: "Активные клиенты в системе",
    },
    {
      title: "Активные проекты",
      value: "0",
      icon: Folder,
      description: "Проекты в процессе выполнения",
    },
    {
      title: "Оценки безопасности",
      value: "0",
      icon: ShieldAlert,
      description: "Завершенные оценки безопасности",
    },
    {
      title: "Ожидающие задачи",
      value: "0",
      icon: CheckSquare,
      description: "Задачи, ожидающие выполнения",
    },
  ]

  try {
    // Получаем количество клиентов
    const clientCount = await sql`SELECT COUNT(*) as count FROM clients`
    stats[0].value = clientCount[0].count.toString()

    // Получаем количество активных проектов
    const activeProjects = await sql`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE status = 'in progress'
    `
    stats[1].value = activeProjects[0].count.toString()

    // Получаем количество завершенных оценок
    const completedAssessments = await sql`
      SELECT COUNT(*) as count 
      FROM assessments 
      WHERE status = 'completed'
    `
    stats[2].value = completedAssessments[0].count.toString()

    // Получаем количество ожидающих задач
    const pendingTasks = await sql`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE status = 'pending'
    `
    stats[3].value = pendingTasks[0].count.toString()
  } catch (e) {
    console.error("Ошибка при получении статистики:", e)
    // Оставляем значения по умолчанию в случае ошибки
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
