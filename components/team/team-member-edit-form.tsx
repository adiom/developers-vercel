"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTeamMember } from "@/lib/team-actions"
import { toast } from "@/components/ui/use-toast"

interface TeamMemberEditFormProps {
  user: {
    id: number
    name: string
    email: string
    role: string
    phone?: string
  }
}

export default function TeamMemberEditForm({ user }: TeamMemberEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateTeamMember(formData)

      if (result.success) {
        toast({
          title: "Профиль обновлен",
          description: "Информация о сотруднике успешно обновлена",
        })
        router.push(`/team/${user.id}`)
        router.refresh()
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось обновить информацию",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Роль</Label>
          <Select value={formData.role} onValueChange={handleRoleChange} required>
            <SelectTrigger id="role">
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="manager">Менеджер</SelectItem>
              <SelectItem value="analyst">Аналитик</SelectItem>
              <SelectItem value="tester">Тестировщик</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(`/team/${user.id}`)}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
