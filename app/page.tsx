import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowRight, Bot, Network, Sparkles } from "lucide-react"
import { ChatLauncher } from "@/components/chat-launcher"
import { PortalLayout } from "@/components/portal-layout"

export const metadata: Metadata = {
  title: { absolute: "Canfly — разработка AI-агентов и цифровых продуктов" },
  description: "Проектируем и создаём AI-агентов и цифровые продукты. Познакомьтесь с платформой Canfly и обсудите свою задачу с ИИ-консультантом.",
  alternates: { canonical: "/" },
}

const agents = [
  { name: "Ингрия", label: "AI-проект", description: "Проект Canfly в области AI-агентов и цифровых продуктов.", href: "/agents/ingria", tone: "from-violet-500/20 to-indigo-500/5" },
  { name: "Кристина", label: "AI-проект", description: "Один из проектов AI-агентов, связанных с Canfly.", href: "/agents/kristina", tone: "from-sky-500/20 to-cyan-500/5" },
  { name: "Банита", label: "AI-проект", description: "Один из проектов AI-агентов, связанных с Canfly.", href: "/agents/banita", tone: "from-emerald-500/20 to-teal-500/5" },
]

export default function Home() {
  return <PortalLayout>
    <section className="relative overflow-hidden bg-[#080b14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(110,94,255,.27),transparent_45%),radial-gradient(ellipse_at_5%_90%,rgba(0,180,216,.12),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200"><Sparkles className="h-4 w-4 text-violet-300" /> Разработка Canfly</div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.06] tracking-tight md:text-7xl">Создаём AI-агентов для реальных задач</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">Canfly объединяет разработку, инфраструктуру и прикладные AI-продукты. Расскажите, что хотите автоматизировать, — ИИ-консультант поможет сформулировать запрос.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#chat" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-medium text-slate-950 transition hover:bg-violet-100">Обсудить задачу <ArrowRight className="h-4 w-4" /></a>
            <Link href="/agents" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-medium text-white transition hover:bg-white/10">Посмотреть агентов</Link>
          </div>
          <a href="#approach" className="mt-14 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">Узнать о Canfly <ArrowDown className="h-4 w-4" /></a>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 rounded-[3rem] bg-violet-500/10 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/[.06] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-400/15 text-violet-200"><Network className="h-5 w-5" /></div><div><p className="font-medium">Экосистема Canfly</p><p className="text-sm text-slate-400">От платформы к продуктам</p></div></div>
            <div className="space-y-3 py-5">
              {["Разработка и технологии", "AI-платформа и интеграции", "Агенты для конкретных задач"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl bg-white/[.045] p-4"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-xs text-violet-200">0{index + 1}</span><span className="text-sm text-slate-200">{item}</span></div>)}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Публичное описание подтверждённых возможностей</div>
          </div>
        </div>
      </div>
    </section>

    <section id="approach" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-700">Подход Canfly</p><h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Технологии, которые становятся полезными продуктами</h2></div><p className="max-w-2xl text-lg leading-8 text-slate-600">На dev.canfly.org мы рассказываем о разработке и показываем примеры AI-агентов, выросших из этой работы. Для каждого проекта путь свой: от задачи и прототипа до интеграции в рабочие процессы.</p></div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{[{ icon: Network, title: "Платформа", body: "Инженерная основа и интеграции, на которых строятся проекты Canfly.", href: "/platform" }, { icon: Bot, title: "AI-агенты", body: "Отдельные продукты с собственными задачами и сценариями использования.", href: "/agents" }, { icon: Sparkles, title: "Разработка", body: "Проектирование и создание решений под задачу заказчика.", href: "/services" }].map(({ icon: Icon, title, body, href }) => <Link key={title} href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"><Icon className="h-6 w-6 text-violet-700" /><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-2 leading-7 text-slate-600">{body}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700">Подробнее <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div>
    </section>

    <section className="bg-slate-50 py-20 md:py-24"><div className="mx-auto max-w-7xl px-6 md:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-700">Продукты</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Агенты Canfly</h2></div><Link href="/agents" className="inline-flex items-center gap-2 font-medium text-violet-700">Все агенты <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3">{agents.map((agent) => <Link href={agent.href} key={agent.name} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"><div className={`flex h-36 items-end bg-gradient-to-br ${agent.tone} p-6`}><div><span className="text-xs font-medium uppercase tracking-wider text-slate-500">{agent.label}</span><h3 className="mt-1 text-2xl font-semibold">{agent.name}</h3></div></div><div className="p-6"><p className="min-h-14 leading-7 text-slate-600">{agent.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700">О проекте <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div></Link>)}</div></div></section>

    <section id="chat" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"><div className="grid gap-10 overflow-hidden rounded-3xl bg-[#0d1020] p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-12"><div><span className="text-sm font-medium text-violet-300">Начните с разговора</span><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Опишите задачу — вместе определим следующий шаг</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">ИИ-консультант расскажет о публичных материалах Canfly, уточнит контекст и поможет отправить заявку команде.</p></div><ChatLauncher /></div></section>
  </PortalLayout>
}
