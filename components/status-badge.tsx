import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  "in progress": "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
  blocked: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase()
  const style = statusStyles[key] || "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
  return (
    <Badge variant="outline" className={cn(style, className)}>{status}</Badge>
  )
}

