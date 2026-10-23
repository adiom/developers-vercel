import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"

const leadSchema = z.object({
  name: z.string().trim().max(120).default(""),
  contact: z.string().trim().min(3).max(240),
  summary: z.string().trim().min(5).max(4000),
  consent: z.literal(true),
})

export async function POST(request: Request) {
  try {
    const parsed = leadSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: "Укажите способ связи и кратко опишите задачу." }, { status: 400 })
    const { name, contact, summary } = parsed.data
    await sql`CREATE TABLE IF NOT EXISTS public_leads (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL,
      summary TEXT NOT NULL,
      consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
    await sql`INSERT INTO public_leads (name, contact, summary) VALUES (${name}, ${contact}, ${summary})`
    return NextResponse.json({ success: true }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Unable to store public lead", error)
    return NextResponse.json({ error: "Не удалось сохранить заявку. Попробуйте ещё раз позже." }, { status: 503 })
  }
}
