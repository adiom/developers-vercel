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
  const [apiKey, setApiKey] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [name, setName] = useState("")

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  const handleGenerateNewKey = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (data.apiKey) {
        setApiKey(data.apiKey.key)
      } else {
        alert(data.error || "Ошибка при создании ключа")
      }
    } catch (error) {
      alert("Ошибка при создании ключа")
    } finally {
      setIsGenerating(false)
    }
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

          <div className="flex items-center gap-4">
            <Input
              placeholder="Название ключа (например, Мой сервис)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateNewKey}
              disabled={isGenerating || !name.trim()}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isGenerating ? "Генерация..." : "Создать новый ключ"}
            </Button>
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
