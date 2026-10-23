import type { Metadata } from "next"
import { InfoCard, PortalPage } from "@/components/portal-page"

export const metadata: Metadata = { title: "Разработка AI-агентов и цифровых продуктов — Canfly", description: "Обсудите с Canfly разработку AI-агента, его интеграцию в веб-продукт или автоматизацию рабочего процесса.", alternates: { canonical: "/services" } }

export default function ServicesPage() {
  return <PortalPage eyebrow="Услуги Canfly" title="От идеи до работающего AI-продукта" intro="Помогаем сформулировать задачу и обсудить разработку AI-агента или цифрового продукта. Состав работ, технологии, сроки и стоимость определяются после знакомства с конкретным проектом.">
    <div className="grid gap-4 md:grid-cols-3"><InfoCard title="Разработка AI-агента">Исследование задачи и обсуждение сценария агента, который может быть частью отдельного продукта или рабочего процесса.</InfoCard><InfoCard title="Веб-продукт и интеграции">Обсуждение веб-интерфейса, взаимодействия с существующими системами и доступных источников данных.</InfoCard><InfoCard title="Прототипирование">Прояснение требований и подготовка первого варианта решения, который можно проверить на реальном сценарии.</InfoCard></div>
    <p className="mt-8 max-w-3xl leading-7 text-slate-600">Перечень описывает направления для первичного обсуждения, а не гарантированный состав услуг или функциональности.</p>
  </PortalPage>
}
