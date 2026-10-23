"use client"

import { useState, type FormEvent } from "react"
import { Bot, LoaderCircle, MessageCircle, Send, X } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }
const greeting: Message = { role: "assistant", content: "Здравствуйте! Я ИИ-консультант Canfly. Расскажите, что хотите создать или автоматизировать — помогу разобраться и подготовить заявку." }

export function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([greeting])
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [showLead, setShowLead] = useState(false)
  const [lead, setLead] = useState({ name: "", contact: "", summary: "" })
  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(false)

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || busy) return
    const next: Message[] = [...messages, { role: "user", content }]
    setMessages(next); setDraft(""); setBusy(true); setError("")
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-12) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Не удалось получить ответ.")
      setMessages((current) => [...current, { role: "assistant", content: data.reply }])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Чат временно недоступен. Вы можете оставить заявку через форму.")
    } finally { setBusy(false) }
  }

  async function submitLead(event: FormEvent) {
    event.preventDefault()
    if (busy || !lead.contact.trim() || !lead.summary.trim()) return
    setBusy(true); setError("")
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, consent: true }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Не удалось отправить заявку. Попробуйте ещё раз.")
      setSent(true); setMessages((current) => [...current, { role: "assistant", content: "Спасибо! Заявка отправлена команде Canfly. Мы свяжемся с вами по указанному контакту." }])
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось отправить заявку.") }
    finally { setBusy(false) }
  }

  return <>
    <button onClick={() => setOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-medium text-slate-950 transition hover:bg-violet-100"><MessageCircle className="h-4 w-4" />Обсудить с ИИ</button>
    {open && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-label="ИИ-консультант Canfly" className="flex h-[min(760px,94dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Bot className="h-5 w-5" /></span><div><p className="font-semibold">ИИ-консультант Canfly</p><p className="text-xs text-slate-500">Знакомство с проектом и заявка</p></div></div><button aria-label="Закрыть чат" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></header>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4" aria-live="polite">{messages.map((message, index) => <div key={index} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-white text-slate-700 shadow-sm" : "ml-auto bg-slate-900 text-white"}`}>{message.content}</div>)}{busy && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Минуту…</div>}{error && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</div>}
          {!sent && <button onClick={() => { setLead((current) => ({ ...current, summary: current.summary || messages.filter((message) => message.role === "user").map((message) => message.content).join("\n") })); setShowLead((value) => !value) }} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-violet-300">{showLead ? "Скрыть форму" : "Оставить заявку"}</button>}
          {showLead && !sent && <form onSubmit={submitLead} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"><label className="block text-sm font-medium">Как к вам обращаться<input value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} maxLength={120} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-violet-500" placeholder="Имя" /></label><label className="block text-sm font-medium">Email или мессенджер для связи<input required value={lead.contact} onChange={(event) => setLead({ ...lead, contact: event.target.value })} maxLength={240} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-violet-500" placeholder="Контакт" /></label><label className="block text-sm font-medium">Кратко о задаче<textarea required value={lead.summary} onChange={(event) => setLead({ ...lead, summary: event.target.value })} maxLength={4000} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-violet-500" placeholder="Что нужно разработать или автоматизировать?" /></label><label className="flex items-start gap-2 text-xs leading-5 text-slate-600"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-violet-700" /><span>Согласен на использование этих данных для ответа на заявку. <a href="/privacy" target="_blank" className="underline">Подробнее</a>.</span></label><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Отправить заявку</button></form>}
        </div>
        {!showLead && !sent && <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-slate-100 p-3"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(event as unknown as FormEvent) } }} maxLength={2000} rows={2} aria-label="Ваше сообщение" placeholder="Напишите о вашей задаче…" className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500" /><button disabled={busy || !draft.trim()} aria-label="Отправить сообщение" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button></form>}
      </section>
    </div>}
  </>
}
