import { DashboardStats } from "@/components/dashboard-stats"
import { RecentClients } from "@/components/recent-clients"
import { RecentProjects } from "@/components/recent-projects"
import { SecurityAlerts } from "@/components/security-alerts"
import { UpcomingTasks } from "@/components/upcoming-tasks"

export default async function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentClients />
        <RecentProjects />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingTasks />
        <SecurityAlerts />
      </div>
    </div>
  )
}
