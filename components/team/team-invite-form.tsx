"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inviteTeamMember } from "@/lib/team-actions"
import { toast } from "@/components/ui/use-toast"

export default function TeamInviteForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const result = await inviteTeamMember(formData)

      if (result.success) {
        toast({
          title: "Приглашение отправлено",
          description: `Приглашение успешно отправлено на адрес ${formData.email}`,
        })
        router.push("/team")
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось отправить приглашение",
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
          <Input
            id="name"
            name="name"
            placeholder="Введите имя сотрудника"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
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

        <div className="grid gap-2">
          <Label htmlFor="message">Сообщение (необязательно)</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Добавьте персональное сообщение к приглашению"
            value={formData.message}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить приглашение"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/team")}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
