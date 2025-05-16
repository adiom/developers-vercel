import { sql } from "@/lib/db"

export interface Client {
  id: number
  name: string
  industry?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  created_at: Date
  updated_at: Date
}

export async function getClientById(id: number): Promise<Client | null> {
  const result = await sql`
    SELECT * FROM clients 
    WHERE id = ${id}
  `
  
  if (result.length === 0) {
    return null
  }

  return result[0]
}

export async function createClient(data: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
  const result = await sql`
    INSERT INTO clients (
      name, 
      industry, 
      contact_person, 
      email, 
      phone, 
      address
    ) VALUES (
      ${data.name},
      ${data.industry},
      ${data.contact_person},
      ${data.email},
      ${data.phone},
      ${data.address}
    )
    RETURNING *
  `
  
  return result[0]
}

export async function updateClient(id: number, data: Partial<Omit<Client, "id" | "created_at" | "updated_at">>): Promise<Client> {
  const result = await sql`
    UPDATE clients
    SET 
      name = COALESCE(${data.name}, name),
      industry = COALESCE(${data.industry}, industry),
      contact_person = COALESCE(${data.contact_person}, contact_person),
      email = COALESCE(${data.email}, email),
      phone = COALESCE(${data.phone}, phone),
      address = COALESCE(${data.address}, address),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  
  return result[0]
}

export async function deleteClient(id: number): Promise<void> {
  await sql`
    DELETE FROM clients
    WHERE id = ${id}
  `
} 