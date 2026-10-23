import { DashboardStats } from "@/components/dashboard-stats"
import { RecentClients } from "@/components/recent-clients"
import { RecentProjects } from "@/components/recent-projects"
import { SecurityAlerts } from "@/components/security-alerts"
import { UpcomingTasks } from "@/components/upcoming-tasks"

export default async function WorkspaceHome() {
  const [stats, clients, projects, tasks, alerts] = await Promise.all([DashboardStats(), RecentClients(), RecentProjects(), UpcomingTasks(), SecurityAlerts()])
  return <div className="space-y-6"><h1 className="text-3xl font-bold">Панель управления</h1>{stats}<div className="grid grid-cols-1 gap-6 md:grid-cols-2">{clients}{projects}</div><div className="grid grid-cols-1 gap-6 md:grid-cols-2">{tasks}{alerts}</div></div>
}
