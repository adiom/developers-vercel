"use client"

import { getUserSessions } from "@/lib/auth-server"
import { SessionsListClient } from "./sessions-list-client"
 
export async function SessionsList() {
  const sessions = await getUserSessions()
  return <SessionsListClient sessions={sessions} />
} 