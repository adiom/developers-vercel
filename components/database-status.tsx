import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database } from "lucide-react"
import { isDatabaseConfigured } from "@/lib/db"

export function DatabaseStatus() {
  if (isDatabaseConfigured()) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <Database className="h-4 w-4" />
      <AlertTitle>Database not configured</AlertTitle>
      <AlertDescription>
        Please set the DATABASE_URL environment variable to connect to your database.
        The application will work in read-only mode until the database is configured.
      </AlertDescription>
    </Alert>
  )
} 