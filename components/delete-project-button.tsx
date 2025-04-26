"use client"

import { useRouter } from "next/navigation"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { deleteProject } from "@/lib/actions"

interface DeleteProjectButtonProps {
  projectId: number
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteProject(projectId)
    if (result.success) {
      router.push("/projects")
      router.refresh()
    }
  }

  return (
    <DeleteConfirmation
      title="Delete Project"
      description={`Are you sure you want to delete project "${projectName}"? This action cannot be undone and will delete all associated tasks and assessments.`}
      onDelete={handleDelete}
    />
  )
}
