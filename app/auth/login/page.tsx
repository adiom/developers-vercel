import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Redirect if already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/workspace")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <LoginForm />
    </div>
  )
}
