import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Filter, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function TeamPage({
  searchParams,
}: {
  searchParams: { search?: string; role?: string }
}) {
  const search = searchParams.search || ""
  const role = searchParams.role || ""

  // Строим запрос с учетом фильтров
  let query = sql`SELECT * FROM users WHERE 1=1`

  if (search) {
    query = sql`${query} AND (name ILIKE ${"%" + search + "%"} OR email ILIKE ${"%" + search + "%"})`
  }

  if (role) {
    query = sql`${query} AND role = ${role}`
  }

  query = sql`${query} ORDER BY name ASC`

  // Получаем список пользователей
  const users = await query

  // Получаем количество задач для каждого пользователя
  const userTaskCounts = await sql`
    SELECT assigned_to, COUNT(*) as task_count 
    FROM tasks 
    WHERE assigned_to IS NOT NULL 
    GROUP BY assigned_to
  `

  // Создаем карту для быстрого доступа к количеству задач
  const taskCountMap = new Map()
  userTaskCounts.forEach((item) => {
    taskCountMap.set(item.assigned_to, item.task_count)
  })

  // Получаем количество оценок для каждого пользователя
  const userAssessmentCounts = await sql`
    SELECT conducted_by, COUNT(*) as assessment_count 
    FROM assessments 
    WHERE conducted_by IS NOT NULL 
    GROUP BY conducted_by
  `

  // Создаем карту для быстрого доступа к количеству оценок
  const assessmentCountMap = new Map()
  userAssessmentCounts.forEach((item) => {
    assessmentCountMap.set(item.conducted_by, item.assessment_count)
  })

  // Функция для получения инициалов из имени
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Функция для определения цвета бейджа роли
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Команда</h1>
        <Button asChild>
          <Link href="/team/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Пригласить сотрудника
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <form>
            <Input
              type="search"
              placeholder="Поиск по имени или email..."
              name="search"
              defaultValue={search}
              className="pl-8"
            />
          </form>
        </div>
        <form className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select name="role" defaultValue={role}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по роли" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все роли</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="manager">Менеджер</SelectItem>
              <SelectItem value="analyst">Аналитик</SelectItem>
              <SelectItem value="tester">Тестировщик</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="secondary" size="sm">
            Применить
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="line-clamp-1">{user.name}</CardTitle>
                  <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm">
                    <div>
                      <span className="font-medium">{taskCountMap.get(user.id) || 0}</span> задач
                    </div>
                    <div>
                      <span className="font-medium">{assessmentCountMap.get(user.id) || 0}</span> оценок
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/team/${user.id}`}>Просмотр профиля</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Сотрудники не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
