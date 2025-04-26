import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { sql } from "@/lib/db"

export async function SecurityAlerts() {
  let alerts = []
  let error = null

  try {
    // Fetch vulnerabilities as security alerts
    alerts = await sql`
      SELECT v.id, v.title, v.severity, v.status, v.created_at, p.name as project_name, a.id as assessment_id
      FROM vulnerabilities v
      JOIN assessments a ON v.assessment_id = a.id
      JOIN projects p ON a.project_id = p.id
      ORDER BY 
        CASE 
          WHEN v.severity = 'Critical' THEN 1
          WHEN v.severity = 'High' THEN 2
          WHEN v.severity = 'Medium' THEN 3
          WHEN v.severity = 'Low' THEN 4
          ELSE 5
        END,
        v.created_at DESC
      LIMIT 5
    `

    // If no vulnerabilities exist yet, use assessments with high risk level as alerts
    if (alerts.length === 0) {
      alerts = await sql`
        SELECT a.id, a.assessment_type as title, a.risk_level as severity, a.status, a.created_at, p.name as project_name, a.id as assessment_id
        FROM assessments a
        JOIN projects p ON a.project_id = p.id
        WHERE a.risk_level IN ('High', 'Critical')
        ORDER BY a.created_at DESC
        LIMIT 5
      `
    }
  } catch (e) {
    console.error("Error fetching security alerts:", e)
    error = "Failed to load security alerts"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Security Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4 text-muted-foreground">{error}</div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{alert.title}</p>
                  <Badge className={getSeverityColor(alert.severity)} variant="outline">
                    {alert.severity || "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">{alert.project_name}</p>
                  <p className="text-muted-foreground">Date: {formatDate(alert.created_at)}</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/assessments/${alert.assessment_id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No security alerts found</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline" asChild>
            <Link href="/vulnerabilities">View All Alerts</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
