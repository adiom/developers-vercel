"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createApiKey, deleteApiKey, getApiKeys, type ApiKey } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface ApiKeySettingsProps {
  userId: number
  initialKeys: ApiKey[]
}

export function ApiKeySettings({ userId, initialKeys }: ApiKeySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const router = useRouter()

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const key = await createApiKey(newKeyName, userId)
      setApiKeys([...apiKeys, key])
      setNewKeyName("")
      toast.success("API ключ успешно создан")
      router.refresh()
    } catch (error) {
      console.error("Error creating API key:", error)
      toast.error("Ошибка при создании API ключа")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: number) => {
    try {
      await deleteApiKey(keyId, userId)
      setApiKeys(apiKeys.filter(key => key.id !== keyId))
      toast.success("API ключ успешно удален")
      router.refresh()
    } catch (error) {
      console.error("Error deleting API key:", error)
      toast.error("Ошибка при удалении API ключа")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Создание API ключа</CardTitle>
          <CardDescription>Создайте новый API ключ для доступа к API</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Название ключа</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Например: Мобильное приложение"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Создание..." : "Создать ключ"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные API ключи</CardTitle>
          <CardDescription>Управление вашими API ключами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">У вас пока нет активных API ключей</p>
            ) : (
              apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-muted-foreground">Создан: {new Date(key.created_at).toLocaleDateString()}</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-2">{key.key}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteKey(key.id)}
                  >
                    Удалить
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 