"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  Lock,
  Settings,
  ShieldAlert,
  Users,
  Folder,
  CheckSquare,
  MessageSquareText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Центр управления",
      path: "/workspace",
      icon: Home,
    },
    {
      name: "Клиенты",
      path: "/workspace/clients",
      icon: Building2,
    },
    {
      name: "Проекты",
      path: "/workspace/projects",
      icon: Folder,
    },
    {
      name: "Оценки безопасности",
      path: "/workspace/assessments",
      icon: ShieldAlert,
    },
    {
      name: "Уязвимости",
      path: "/workspace/vulnerabilities",
      icon: Lock,
    },
    {
      name: "Задачи",
      path: "/workspace/tasks",
      icon: CheckSquare,
    },
    {
      name: "Отчеты",
      path: "/workspace/reports",
      icon: FileText,
    },
    {
      name: "Команда",
      path: "/workspace/team",
      icon: Users,
    },
    {
      name: "Аналитика",
      path: "/workspace/analytics",
      icon: BarChart3,
    },
    {
      name: "Настройки",
      path: "/workspace/settings",
      icon: Settings,
    },
  ]
  if (isAdmin) routes.splice(2, 0, { name: "Заявки с сайта", path: "/workspace/leads", icon: MessageSquareText })

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/workspace" className="flex items-center gap-2 font-semibold">
          <ShieldAlert className="h-6 w-6" />
          <span>Разработка</span>
        </Link>
      </div>
      <div className="py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={pathname === route.path ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", pathname === route.path && "bg-muted")}
              asChild
            >
              <Link href={route.path}>
                <route.icon className="h-5 w-5" />
                {route.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
