import { NextResponse } from "next/server"
import { updateClient } from "@/lib/api"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return new NextResponse("Invalid client ID", { status: 400 })
    }

    const data = await request.json()
    const updatedClient = await updateClient(parsedId, data)

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Error updating client:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 