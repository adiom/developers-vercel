import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"

export async function RecentClients() {
  let clients = []
  let error = null

  try {
    // Fetch the 5 most recently added clients
    clients = await sql`
      SELECT id, name, industry, contact_person, email
      FROM clients
      ORDER BY created_at DESC
      LIMIT 5
    `
  } catch (e) {
    console.error("Ошибка при получении недавних клиентов:", e)
    error = "Не удалось загрузить клиентов"
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Клиенты</CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link href="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить клиента
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4 text-muted-foreground">{error}</div>
        ) : clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.industry || "Не указана"}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/clients/${client.id}`}>Просмотр</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Клиенты не найдены</p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/clients/new">Добавить первого клиента</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
