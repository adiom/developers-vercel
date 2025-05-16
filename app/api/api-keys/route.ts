import { NextResponse } from "next/server"
import { createApiKey, getCurrentUser } from "@/lib/auth"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { name } = await req.json()
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  try {
    const apiKey = await createApiKey(name, user.user_id || user.id)
    return NextResponse.json({ apiKey })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
} 