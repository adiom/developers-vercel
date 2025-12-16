export function formatDisplayDate(dateString: string | null | undefined, fallback: string = "Not set") {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return fallback
  return date.toLocaleDateString()
}

