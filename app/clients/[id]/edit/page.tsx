import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientEditForm } from "@/components/client-edit-form"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"

interface EditClientPageProps {
  params: {
    id: string
  }
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  // Получаем ID клиента из параметров
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    notFound()
  }

  // Получаем данные клиента
  const clientResult = await sql`SELECT * FROM clients WHERE id = ${clientId}`

  if (clientResult.length === 0) {
    notFound()
  }

  const client = clientResult[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редактирование клиента</h1>
        <p className="text-muted-foreground">Обновите информацию о клиенте</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о клиенте</CardTitle>
          <CardDescription>Внесите необходимые изменения</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientEditForm client={client} />
        </CardContent>
      </Card>
    </div>
  )
}
