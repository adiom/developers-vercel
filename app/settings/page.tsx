import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserSettings } from "@/components/settings/user-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { ApiSettings } from "@/components/settings/api-settings"
import { User, Bell, Shield, Code } from "lucide-react"
import { requireAuth } from "@/lib/auth"

export default async function SettingsPage() {
  // Проверяем авторизацию пользователя
  const user = await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">Управление настройками учетной записи и системы</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
          <UserSettings user={user} />
        </TabsContent>

        <TabsContent value="security" className="pt-4">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="api" className="pt-4">
          <ApiSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
