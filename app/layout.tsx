import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/auth"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dev.canfly.org"),
  title: { default: "Canfly — разработка AI-агентов и цифровых продуктов", template: "%s | Canfly" },
  description: "Портал разработки Canfly: платформа, AI-агенты и проекты для бизнеса.",
  applicationName: "Canfly",
}

type User = {
  user_id: number
  email: string
  name: string
  role: string
} | null

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const isWorkspace = requestHeaders.get("x-canfly-workspace") === "1"
  const user = isWorkspace ? await getCurrentUser() as User : null
  if (isWorkspace && !user) redirect("/workspace/login")

  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isWorkspace ? <div className="flex h-screen overflow-hidden"><Sidebar isAdmin={user?.role === "admin"} /><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header user={user} /><main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">{children}</main></div></div> : children}
        </ThemeProvider>
      </body>
    </html>
  )
}
