"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTask } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  project_id: number
  assigned_to: number
}

interface Project {
  id: number
  name: string
}

interface User {
  id: number
  name: string
}

export default function TaskEditForm({
  task,
  projects,
  users,
}: {
  task: Task
  projects: Project[]
  users: User[]
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status || "pending",
    priority: task.priority || "medium",
    due_date: task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "",
    project_id: task.project_id?.toString() || "",
    assigned_to: task.assigned_to?.toString() || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Преобразуем строковые ID в числа
      const projectId = formData.project_id ? Number.parseInt(formData.project_id) : null
      const assignedTo = formData.assigned_to ? Number.parseInt(formData.assigned_to) : null

      const result = await updateTask({
        id: task.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date,
        project_id: projectId,
        assigned_to: assignedTo,
      })

      if (result.success) {
        toast({
          title: "Задача обновлена",
          description: "Задача была успешно обновлена.",
        })
        router.push(`/tasks/${task.id}`)
        router.refresh()
      } else {
        throw new Error(result.error || "Не удалось обновить задачу")
      }
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задачу. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">В ожидании</SelectItem>
                  <SelectItem value="in_progress">В процессе</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Приоритет</Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="critical">Критический</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Срок выполнения</Label>
              <Input id="due_date" name="due_date" type="date" value={formData.due_date} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_id">Проект</Label>
              <Select value={formData.project_id} onValueChange={(value) => handleSelectChange("project_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите проект" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Назначено</Label>
            <Select value={formData.assigned_to} onValueChange={(value) => handleSelectChange("assigned_to", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите исполнителя" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
