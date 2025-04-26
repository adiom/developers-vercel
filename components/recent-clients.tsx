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
    console.error("Error fetching recent clients:", e)
    error = "Failed to load recent clients"
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Clients</CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link href="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
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
                  <p className="text-sm text-muted-foreground">{client.industry || "No industry specified"}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/clients/${client.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No clients found</p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/clients/new">Add Your First Client</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
