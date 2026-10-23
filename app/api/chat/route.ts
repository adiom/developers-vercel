import { NextResponse } from "next/server"

const publicKnowledge = `Canfly разрабатывает AI-агентов и цифровые продукты. Открытый портал dev.canfly.org описывает разработку, платформу и публичные примеры агентов: Ингрия, Кристина и Банита. Компания предлагает обсудить проект по созданию или интеграции AI-агента. Публичные материалы не содержат подробных технических гарантий, цен, сроков и описаний конкретных возможностей продуктов.`

export async function POST(request: Request) {
  const endpoint = process.env.AI_CHAT_API_URL
  const apiKey = process.env.AI_CHAT_API_KEY
  const model = process.env.AI_CHAT_MODEL
  if (!endpoint || !apiKey || !model) return NextResponse.json({ error: "ИИ-консультант временно недоступен. Вы можете оставить заявку через форму." }, { status: 503 })

  try {
    const body = await request.json()
    if (!Array.isArray(body.messages) || body.messages.length > 12) return NextResponse.json({ error: "Неверный формат сообщений." }, { status: 400 })
    const messages = body.messages.map((message: { role?: string; content?: unknown }) => {
      if (!message || !["user", "assistant"].includes(message.role ?? "") || typeof message.content !== "string" || message.content.length > 2000) throw new Error("invalid_messages")
      return { role: message.role, content: message.content }
    })
    if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "Добавьте сообщение, чтобы продолжить." }, { status: 400 })

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0.3, max_tokens: 500, messages: [
        { role: "system", content: `Ты консультант Canfly на публичном сайте. Отвечай на русском кратко, доброжелательно и только на основе этих открытых фактов: ${publicKnowledge} Не выдумывай цены, сроки, конкретные технологии, функции агентов, клиентов или гарантии. Если информации нет, прямо скажи это и предложи передать вопрос команде через заявку. Помогай понять задачу и напоминай, что посетитель может оставить заявку.` },
        ...messages,
      ] }),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    })
    if (!response.ok) throw new Error("provider_error")
    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content
    if (typeof reply !== "string" || !reply.trim()) throw new Error("empty_reply")
    return NextResponse.json({ reply: reply.slice(0, 4000) }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_messages") return NextResponse.json({ error: "Неверный формат сообщений." }, { status: 400 })
    return NextResponse.json({ error: "ИИ-консультант временно недоступен. Вы можете оставить заявку через форму." }, { status: 503 })
  }
}
