"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function ApiSettings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("sk_live_51NZXr3JHwNX6S8kGqLREG6...")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  const handleGenerateNewKey = () => {
    setIsGenerating(true)
    // Имитация генерации нового ключа
    setTimeout(() => {
      setApiKey("sk_live_" + Math.random().toString(36).substring(2, 15))
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API ключи</CardTitle>
          <CardDescription>Управление ключами API для интеграции с другими системами</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API ключ</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Input id="api-key" type={showApiKey ? "text" : "password"} value={apiKey} readOnly className="pr-10" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={handleCopyApiKey} className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateNewKey}
              disabled={isGenerating}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isGenerating ? "Генерация..." : "Создать новый ключ"}
            </Button>
            <p className="text-sm text-muted-foreground">Создан: 01.04.2023</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки API</CardTitle>
          <CardDescription>Настройте параметры доступа к API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ограничение по IP</h3>
              <p className="text-sm text-muted-foreground">Разрешить доступ только с определенных IP-адресов</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ограничение запросов</h3>
              <p className="text-sm text-muted-foreground">Ограничить количество запросов в минуту</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Логирование запросов</h3>
              <p className="text-sm text-muted-foreground">Вести журнал всех API-запросов</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Сохранить настройки</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook-интеграции</CardTitle>
          <CardDescription>Настройте webhook-уведомления для внешних систем</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL для webhook</Label>
            <Input id="webhook-url" placeholder="https://example.com/webhook" />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">События для уведомлений</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Новые уязвимости</h4>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Обновления задач</h4>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Новые отчеты</h4>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Сохранить webhook</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
