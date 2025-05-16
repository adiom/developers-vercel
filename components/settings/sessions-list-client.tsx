"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Session {
  id: number
  ip_address: string | null
  created_at: string
  token: string
}

interface SessionsListClientProps {
  sessions: Session[]
}

export function SessionsListClient({ sessions }: SessionsListClientProps) {
  const router = useRouter()

  const handleDeleteSession = async (token: string) => {
    try {
      const response = await fetch("/api/sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete session")
      }

      toast.success("Сеанс завершен")
      router.refresh()
    } catch (error) {
      console.error("Error deleting session:", error)
      toast.error("Ошибка при завершении сеанса")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сеансы</CardTitle>
        <CardDescription>Управление активными сеансами и устройствами</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session, index) => (
          <div key={session.id} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {index === 0 ? "Текущий сеанс" : `Сеанс ${index + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {session.ip_address ? `IP: ${session.ip_address}` : "IP: Неизвестно"} • {format(new Date(session.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
              </p>
            </div>
            <Button 
              variant={index === 0 ? "outline" : "default"} 
              size="sm" 
              disabled={index === 0}
              onClick={() => handleDeleteSession(session.token)}
            >
              {index === 0 ? "Текущий" : "Завершить"}
            </Button>
          </div>
        ))}
        {sessions.length > 1 && (
          <div className="flex justify-end">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                sessions.forEach(session => {
                  if (session !== sessions[0]) {
                    handleDeleteSession(session.token)
                  }
                })
              }}
            >
              Завершить все другие сеансы
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 