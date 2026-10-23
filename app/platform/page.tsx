import type { Metadata } from "next"
import { InfoCard, PortalPage } from "@/components/portal-page"

export const metadata: Metadata = { title: "Платформа Canfly — разработка и технологии", description: "Подход Canfly к разработке AI-агентов, интеграциям и цифровым продуктам.", alternates: { canonical: "/platform" } }

export default function PlatformPage() {
  return <PortalPage eyebrow="Платформа Canfly" title="Общая инженерная основа для разных продуктов" intro="Canfly развивает собственную разработку и использует современные веб-технологии и базы данных. На этой основе создаются отдельные цифровые продукты и AI-агенты.">
    <div className="grid gap-4 md:grid-cols-3"><InfoCard title="Веб-приложения">В проекте используются Next.js и React — технологии для создания современных веб-приложений.</InfoCard><InfoCard title="Данные и интеграции">Текущая платформа использует PostgreSQL в Neon и поддерживает программные интерфейсы для интеграции.</InfoCard><InfoCard title="Практическая разработка">Архитектура и состав решения выбираются под задачу проекта. Публичный сайт не раскрывает закрытую конфигурацию и данные клиентов.</InfoCard></div>
    <p className="mt-8 max-w-3xl leading-7 text-slate-600">Состав технологий указан по текущему проекту. Он не является обещанием использовать тот же стек в каждом заказе.</p>
  </PortalPage>
}
