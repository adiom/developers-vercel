import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { sql } from "@/lib/db"
import { notFound, redirect } from "next/navigation"

interface AssessmentPageProps {
  params: {
    id: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  // If the id is "new", redirect to the assessment creation page
  if (params.id === "new") {
    redirect("/assessments/new")
  }

  // Parse the assessment ID and ensure it's a valid number
  const assessmentId = Number.parseInt(params.id)

  if (isNaN(assessmentId)) {
    notFound()
  }

  // Fetch assessment details
  const assessmentResult = await sql`
    SELECT a.*, p.name as project_name, p.id as project_id, u.name as conducted_by_name 
    FROM assessments a
    JOIN projects p ON a.project_id = p.id
    LEFT JOIN users u ON a.conducted_by = u.id
    WHERE a.id = ${assessmentId}
  `

  if (assessmentResult.length === 0) {
    notFound()
  }

  const assessment = assessmentResult[0]

  // Fetch vulnerabilities for this assessment
  const vulnerabilities = await sql`
    SELECT * FROM vulnerabilities
    WHERE assessment_id = ${assessmentId}
    ORDER BY severity DESC, created_at DESC
  `

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "in progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/assessments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{assessment.assessment_type}</h1>
        <Badge className={getStatusColor(assessment.status)} variant="outline">
          {assessment.status}
        </Badge>
        {assessment.risk_level && (
          <Badge className={getRiskLevelColor(assessment.risk_level)} variant="outline">
            {assessment.risk_level} Risk
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assessment Details</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/assessments/${assessmentId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Assessment
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Project</h3>
                  <p>
                    <Link href={`/projects/${assessment.project_id}`} className="hover:underline">
                      {assessment.project_name}
                    </Link>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{assessment.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Conducted By</h3>
                  <p>{assessment.conducted_by_name || "Not assigned"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assessment Date</h3>
                  <p>{formatDate(assessment.assessment_date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
                  <p>{assessment.risk_level || "Not assessed"}</p>
                </div>
              </div>

              {assessment.findings && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Findings</h3>
                  <p className="mt-1 whitespace-pre-wrap">{assessment.findings}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Vulnerabilities</h3>
                <p className="text-2xl font-bold">{vulnerabilities.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{new Date(assessment.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{new Date(assessment.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vulnerabilities</CardTitle>
          <Button size="sm" asChild>
            <Link href={`/vulnerabilities/new?assessment=${assessmentId}`}>Add Vulnerability</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {vulnerabilities.length > 0 ? (
            <div className="space-y-4">
              {vulnerabilities.map((vulnerability) => (
                <div
                  key={vulnerability.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{vulnerability.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Severity: {vulnerability.severity} • Status: {vulnerability.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/vulnerabilities/${vulnerability.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No vulnerabilities found for this assessment</p>
              <Button size="sm" className="mt-2" asChild>
                <Link href={`/vulnerabilities/new?assessment=${assessmentId}`}>Add First Vulnerability</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
