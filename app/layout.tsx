import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Портал разработки dev.canfly.org",
  description: "dev.canfly.org",
    generator: 'v0.dev'
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
  const user = await getCurrentUser() as User

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            {user && <Sidebar />}
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header user={user} />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/40">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
