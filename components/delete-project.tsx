"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { deleteProject } from "@/lib/actions"

interface DeleteProjectProps {
  projectId: number
}

export function DeleteProject({ projectId }: DeleteProjectProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const result = await deleteProject(projectId)
      if (result.success) {
        router.push("/projects")
        router.refresh()
      } else {
        console.error("Failed to delete project:", result.error)
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  return (
    <DeleteConfirmation
      title="Delete Project"
      description="Are you sure you want to delete this project? This action cannot be undone and will delete all associated tasks and assessments."
      onDelete={handleDelete}
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      }
    />
  )
}
