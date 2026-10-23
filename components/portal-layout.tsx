import Link from "next/link"
import type { ReactNode } from "react"
import { Network } from "lucide-react"

export function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white text-slate-950">
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
      <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white"><Network className="h-4 w-4" /></span><span>CANFLY <span className="font-normal text-slate-500">/ разработка</span></span></Link>
      <nav aria-label="Основная навигация" className="hidden items-center gap-7 text-sm text-slate-600 md:flex"><Link className="hover:text-slate-950" href="/platform">Платформа</Link><Link className="hover:text-slate-950" href="/services">Разработка</Link><Link className="hover:text-slate-950" href="/agents">AI-агенты</Link></nav>
      <Link href="/workspace/login" className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">Для команды</Link>
    </div><nav aria-label="Мобильная навигация" className="flex gap-5 overflow-x-auto border-t border-slate-100 px-5 py-2.5 text-sm text-slate-600 md:hidden"><Link href="/platform">Платформа</Link><Link href="/services">Разработка</Link><Link href="/agents">AI-агенты</Link></nav></header>
    <main>{children}</main>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-9 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-10"><Link href="/" className="font-semibold tracking-wide text-slate-900">CANFLY <span className="font-normal text-slate-500">/ разработка</span></Link><div className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/platform">Платформа</Link><Link href="/services">Услуги</Link><Link href="/agents">Агенты</Link><Link href="/privacy">Конфиденциальность</Link></div><p>Разработка Canfly</p></div></footer>
  </div>
}
