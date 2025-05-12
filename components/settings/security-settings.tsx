"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    } catch (error) {
      console.error("Error changing password:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Изменение пароля</CardTitle>
          <CardDescription>Обновите ваш пароль для повышения безопасности</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input id="current-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input id="new-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтверждение пароля</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Изменить пароль"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Двухфакторная аутентификация</CardTitle>
          <CardDescription>Повысьте безопасность вашей учетной записи с помощью 2FA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Аутентификация по SMS</h3>
              <p className="text-sm text-muted-foreground">Получайте коды подтверждения по SMS</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Приложение-аутентификатор</h3>
              <p className="text-sm text-muted-foreground">Используйте Google Authenticator или другое приложение</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Резервные коды</h3>
              <p className="text-sm text-muted-foreground">Создайте резервные коды для экстренного доступа</p>
            </div>
            <Button variant="outline" size="sm">
              Создать коды
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Сеансы</CardTitle>
          <CardDescription>Управление активными сеансами и устройствами</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Текущий сеанс</h3>
              <p className="text-sm text-muted-foreground">Chrome на Windows • Москва, Россия • Сейчас</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Текущий
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Мобильное устройство</h3>
              <p className="text-sm text-muted-foreground">Safari на iPhone • Санкт-Петербург, Россия • 2 дня назад</p>
            </div>
            <Button variant="outline" size="sm">
              Завершить
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="destructive" size="sm">
              Завершить все другие сеансы
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
