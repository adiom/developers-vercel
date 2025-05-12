"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    } catch (error) {
      console.error("Error saving notification settings:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки уведомлений</CardTitle>
          <CardDescription>Настройте способы получения уведомлений</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Способы уведомлений</h3>
            <RadioGroup defaultValue="email" className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Только по электронной почте</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="push" id="push" />
                <Label htmlFor="push">Только push-уведомления</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Email и push-уведомления</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">Отключить все уведомления</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Типы уведомлений</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Новые уязвимости</h4>
                <p className="text-sm text-muted-foreground">Уведомления о новых обнаруженных уязвимостях</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Обновления задач</h4>
                <p className="text-sm text-muted-foreground">Уведомления об изменениях в назначенных задачах</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Завершение проектов</h4>
                <p className="text-sm text-muted-foreground">Уведомления о завершении проектов</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Отчеты</h4>
                <p className="text-sm text-muted-foreground">Уведомления о новых доступных отчетах</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Маркетинговые сообщения</h4>
                <p className="text-sm text-muted-foreground">Новости, обновления и предложения</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
