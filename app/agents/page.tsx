import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PortalPage } from "@/components/portal-page"

export const metadata: Metadata = { title: "AI-агенты Canfly — проекты и продукты", description: "Познакомьтесь с проектами AI-агентов Canfly и узнайте о подходе к созданию отдельных цифровых продуктов.", alternates: { canonical: "/agents" } }
const agents = [{ slug: "ingria", name: "Ингрия", copy: "Проект Canfly в области AI-агентов и цифровых продуктов." }, { slug: "kristina", name: "Кристина", copy: "Один из AI-проектов, связанных с Canfly." }, { slug: "banita", name: "Банита", copy: "Один из AI-проектов, связанных с Canfly." }]

export default function AgentsPage() {
  return <PortalPage eyebrow="Продукты и проекты" title="AI-агенты Canfly" intro="Каждый агент — отдельный продукт со своим назначением. Здесь собраны публичные проекты Canfly; описания и ссылки будут расширяться по мере публикации подтверждённой информации.">
    <div className="grid gap-4 md:grid-cols-3">{agents.map((agent) => <Link key={agent.slug} href={`/agents/${agent.slug}`} className="group rounded-2xl border border-slate-200 p-6 transition hover:border-violet-300 hover:shadow-lg"><p className="text-xs font-semibold uppercase tracking-wider text-violet-700">AI-проект Canfly</p><h2 className="mt-3 text-2xl font-semibold">{agent.name}</h2><p className="mt-3 min-h-14 leading-7 text-slate-600">{agent.copy}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700">Подробнее <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div>
  </PortalPage>
}
