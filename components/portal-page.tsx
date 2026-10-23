import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { PortalLayout } from "@/components/portal-layout"

export function PortalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <PortalLayout><section className="bg-[#080b14] text-white"><div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"><p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-300">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p></div></section><section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">{children}<div className="mt-16 rounded-3xl bg-slate-950 p-8 text-white md:flex md:items-center md:justify-between md:p-10"><div><p className="text-2xl font-semibold">Есть задача для Canfly?</p><p className="mt-2 text-slate-300">Обсудите её с ИИ-консультантом и отправьте команде заявку.</p></div><Link href="/#chat" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-slate-950 md:mt-0">Обсудить проект <ArrowRight className="h-4 w-4" /></Link></div></section></PortalLayout>
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold">{title}</h2><div className="mt-3 leading-7 text-slate-600">{children}</div></article>
}
