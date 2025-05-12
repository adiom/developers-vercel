"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { updateAssessment } from "@/lib/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const assessmentFormSchema = z.object({
  id: z.number(),
  project_id: z.coerce.number({
    required_error: "Пожалуйста, выберите проект.",
  }),
  assessment_type: z.string().min(2, {
    message: "Тип оценки должен содержать не менее 2 символов.",
  }),
  findings: z.string().optional(),
  risk_level: z.string().optional(),
  conducted_by: z.coerce.number().optional(),
  assessment_date: z.date().optional(),
  status: z.string().default("pending"),
})

type AssessmentFormValues = z.infer<typeof assessmentFormSchema>

interface AssessmentEditFormProps {
  assessment: any
  projects: { id: number; name: string }[]
  users: { id: number; name: string }[]
}

export function AssessmentEditForm({ assessment, projects, users }: AssessmentEditFormProps) {
  const router = useRouter()

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      id: assessment.id,
      project_id: assessment.project_id,
      assessment_type: assessment.assessment_type,
      findings: assessment.findings || "",
      risk_level: assessment.risk_level || "Medium",
      conducted_by: assessment.conducted_by || undefined,
      assessment_date: assessment.assessment_date ? new Date(assessment.assessment_date) : undefined,
      status: assessment.status,
    },
  })

  // Update the onSubmit function to handle async operations properly
  async function onSubmit(data: AssessmentFormValues) {
    try {
      // Convert date to ISO string for database storage
      const formattedData = {
        ...data,
        assessment_date: data.assessment_date ? data.assessment_date.toISOString().split("T")[0] : undefined,
      }

      const result = await updateAssessment(formattedData)
      if (result.success) {
        router.push(`/assessments/${assessment.id}`)
        router.refresh()
      } else {
        console.error("Failed to update assessment:", result.error)
      }
    } catch (error) {
      console.error("Error updating assessment:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Проект</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип оценки</FormLabel>
              <FormControl>
                <Input placeholder="Оценка уязвимостей сети" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="conducted_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Проведена</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? Number.parseInt(value) : undefined)}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите сотрудника" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assessment_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата оценки</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Выберите дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="in progress">В процессе</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="risk_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Уровень риска</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень риска" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Низкий</SelectItem>
                    <SelectItem value="Medium">Средний</SelectItem>
                    <SelectItem value="High">Высокий</SelectItem>
                    <SelectItem value="Critical">Критический</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="findings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Результаты</FormLabel>
              <FormControl>
                <Textarea placeholder="Подробные результаты оценки..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit">Сохранить изменения</Button>
        </div>
      </form>
    </Form>
  )
}
