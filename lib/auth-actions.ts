"use server"

import { sql } from "./db"
import { hashPassword, verifyPassword, setAuthCookie, clearAuthCookie } from "./auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // Validate input
  if (!email || !password || !name) {
    return { success: false, error: "All fields are required" }
  }

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const result = await sql`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (${email}, ${name}, ${hashedPassword}, 'user')
      RETURNING id
    `

    // Set the auth cookie
    await setAuthCookie(result[0].id)

    revalidatePath("/")
    redirect("/")

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    // Get the user
    const users = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`

    if (users.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify the password
    const isValid = await verifyPassword(users[0].password_hash, password)

    if (!isValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Set the auth cookie
    await setAuthCookie(users[0].id)

    revalidatePath("/")
    redirect("/")

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logoutUser() {
  clearAuthCookie()
  revalidatePath("/")
  redirect("/auth/login")
}
