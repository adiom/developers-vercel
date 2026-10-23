import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { PortalPage } from "@/components/portal-page"

const agents = {
  ingria: { name: "Ингрия", description: "AI-проект Canfly. Публичная информация о его возможностях будет добавлена по мере подготовки подтверждённого описания.", external: process.env.NEXT_PUBLIC_INGRIA_URL },
  kristina: { name: "Кристина", description: "AI-проект в экосистеме Canfly. Подробности о назначении и возможностях публикуются только после их подтверждения.", external: process.env.NEXT_PUBLIC_KRISTINA_URL },
  banita: { name: "Банита", description: "AI-проект в экосистеме Canfly. Подробности о назначении и возможностях публикуются только после их подтверждения.", external: process.env.NEXT_PUBLIC_BANITA_URL },
} as const

export function generateStaticParams() { return Object.keys(agents).map((slug) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const agent = agents[slug as keyof typeof agents]
  return agent ? { title: `${agent.name} — AI-проект Canfly`, description: agent.description, alternates: { canonical: `/agents/${slug}` } } : { title: "AI-проект Canfly" }
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agent = agents[slug as keyof typeof agents]
  if (!agent) notFound()
  return <PortalPage eyebrow="AI-проект Canfly" title={agent.name} intro={agent.description}>
    <div className="max-w-3xl rounded-2xl border border-slate-200 p-6 leading-7 text-slate-600"><p>Это часть портфеля проектов Canfly. Мы дополняем публичные описания по мере подтверждения информации о назначении, доступности и сценариях использования.</p>{agent.external && <a href={agent.external} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-medium text-violet-700">Открыть сайт проекта <ArrowUpRight className="h-4 w-4" /></a>}<p className="mt-5"><Link href="/agents" className="underline">Все проекты агентов</Link></p></div>
  </PortalPage>
}
