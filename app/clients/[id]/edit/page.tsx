import { notFound } from "next/navigation"
import { getClientById } from "@/lib/api"
import { ClientForm } from "@/components/clients/client-form"

interface EditClientPageProps {
  params: Promise<{ id: string }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const resolvedParams = await params
  const clientId = Number.parseInt(resolvedParams.id)

  if (isNaN(clientId)) {
    notFound()
  }

  const client = await getClientById(clientId)

  if (!client) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      <ClientForm client={client} />
    </div>
  )
}
