import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function VulnerabilitiesPage() {
  // Получаем уязвимости из базы данных с информацией об оценке и проекте
  const vulnerabilities = await sql`
    SELECT v.*, a.assessment_type, p.name as project_name 
    FROM vulnerabilities v
    JOIN assessments a ON v.assessment_id = a.id
    JOIN projects p ON a.project_id = p.id
    ORDER BY 
      CASE 
        WHEN v.severity = 'Critical' THEN 1
        WHEN v.severity = 'High' THEN 2
        WHEN v.severity = 'Medium' THEN 3
        WHEN v.severity = 'Low' THEN 4
        ELSE 5
      END,
      v.created_at DESC
  `

  const openVulnerabilities = vulnerabilities.filter((vuln) => vuln.status.toLowerCase() === "open")
  const inProgressVulnerabilities = vulnerabilities.filter(
    (vuln) => vuln.status.toLowerCase() === "in progress" || vuln.status.toLowerCase() === "mitigated",
  )
  const closedVulnerabilities = vulnerabilities.filter((vuln) => vuln.status.toLowerCase() === "closed")

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Уязвимости</h1>
        <Button asChild>
          <Link href="/vulnerabilities/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить уязвимость
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск уязвимостей..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Открытые ({openVulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="in-progress">В работе ({inProgressVulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="closed">Закрытые ({closedVulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="all">Все ({vulnerabilities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="pt-4">
          <VulnerabilityList
            vulnerabilities={openVulnerabilities}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="in-progress" className="pt-4">
          <VulnerabilityList
            vulnerabilities={inProgressVulnerabilities}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="closed" className="pt-4">
          <VulnerabilityList
            vulnerabilities={closedVulnerabilities}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <VulnerabilityList
            vulnerabilities={vulnerabilities}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VulnerabilityList({ vulnerabilities, getSeverityColor, getStatusColor }) {
  if (vulnerabilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Уязвимости не найдены</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">В этой категории нет уязвимостей.</p>
          <Button asChild>
            <Link href="/vulnerabilities/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить уязвимость
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-3">Название</div>
        <div className="col-span-2">Серьезность</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-2">Проект</div>
        <div className="col-span-2">Оценка</div>
        <div className="col-span-1"></div>
      </div>
      {vulnerabilities.map((vulnerability) => (
        <div key={vulnerability.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
          <div className="col-span-3 font-medium">{vulnerability.title}</div>
          <div className="col-span-2">
            <Badge className={getSeverityColor(vulnerability.severity)} variant="outline">
              {vulnerability.severity}
            </Badge>
          </div>
          <div className="col-span-2">
            <Badge className={getStatusColor(vulnerability.status)} variant="outline">
              {vulnerability.status}
            </Badge>
          </div>
          <div className="col-span-2">{vulnerability.project_name}</div>
          <div className="col-span-2">{vulnerability.assessment_type}</div>
          <div className="col-span-1 text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/vulnerabilities/${vulnerability.id}`}>Просмотр</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
