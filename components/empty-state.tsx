import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  actionHref: string
  actionLabel: string
}

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        <Button asChild>
          <Link href={actionHref}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}

