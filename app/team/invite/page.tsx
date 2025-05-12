import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import TeamInviteForm from "@/components/team/team-invite-form"

export default function TeamInvitePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Назад</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Пригласить сотрудника</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о приглашении</CardTitle>
          <CardDescription>Заполните форму ниже, чтобы отправить приглашение новому сотруднику.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamInviteForm />
        </CardContent>
      </Card>
    </div>
  )
}
