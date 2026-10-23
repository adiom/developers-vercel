import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"

type Lead = { id: number; name: string; contact: string; summary: string; created_at: string }

export default async function LeadsPage() {
  await requireAdmin()
  const leads = await sql`SELECT id, name, contact, summary, created_at FROM public_leads ORDER BY created_at DESC LIMIT 100` as Lead[]
  return <div className="mx-auto max-w-5xl space-y-6"><div><h1 className="text-3xl font-bold">Заявки с сайта</h1><p className="mt-2 text-muted-foreground">Обращения, отправленные посетителями через публичный портал.</p></div>{leads.length ? <div className="space-y-4">{leads.map((lead) => <Card key={lead.id}><CardHeader className="flex flex-row items-start justify-between gap-4"><CardTitle className="text-lg">{lead.name || "Без имени"}</CardTitle><time className="shrink-0 text-sm text-muted-foreground">{new Date(lead.created_at).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" })}</time></CardHeader><CardContent className="space-y-3"><p><span className="font-medium">Контакт:</span> <a className="underline" href={lead.contact.includes("@") ? `mailto:${lead.contact}` : undefined}>{lead.contact}</a></p><p className="whitespace-pre-wrap leading-7 text-muted-foreground">{lead.summary}</p></CardContent></Card>)}</div> : <Card><CardContent className="py-12 text-center text-muted-foreground">Пока нет заявок.</CardContent></Card>}</div>
}
