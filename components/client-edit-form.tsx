"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { updateClient } from "@/lib/actions"

const clientFormSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: "Название должно содержать не менее 2 символов.",
  }),
  industry: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientEditFormProps {
  client: any
}

export function ClientEditForm({ client }: ClientEditFormProps) {
  const router = useRouter()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client.id,
      name: client.name,
      industry: client.industry || "",
      contact_person: client.contact_person || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    },
  })

  async function onSubmit(data: ClientFormValues) {
    try {
      // Set loading state
      const result = await updateClient(data)
      if (result.success) {
        router.push(`/clients/${client.id}`)
        router.refresh()
      } else {
        console.error("Failed to update client:", result.error)
      }
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название компании</FormLabel>
              <FormControl>
                <Input placeholder="ООО Рога и Копыта" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отрасль</FormLabel>
              <FormControl>
                <Input placeholder="Технологии" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Контактное лицо</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (999) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Textarea placeholder="г. Москва, ул. Примерная, д. 123" {...field} />
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
