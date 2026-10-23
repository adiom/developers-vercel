import { NextResponse, type NextRequest } from "next/server"
import { updateClient } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return new NextResponse("Invalid client ID", { status: 400 })
    }

    const ownedClient = await sql`SELECT id FROM clients WHERE id = ${parsedId} AND user_id = ${user.user_id}`
    if (!ownedClient.length) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const data = await request.json()
    const updatedClient = await updateClient(parsedId, data)

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Error updating client:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
