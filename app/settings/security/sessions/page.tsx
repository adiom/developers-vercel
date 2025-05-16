import { getUserSessions } from "@/lib/auth-server"
import { SessionsListClient } from "@/components/settings/sessions-list-client"
 
export default async function SessionsPage() {
  const sessions = await getUserSessions()
  return <SessionsListClient sessions={sessions} />
} 