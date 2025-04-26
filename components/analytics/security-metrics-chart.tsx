"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface SecurityMetricsChartProps {
  data: {
    month: string
    mttr: number
    vulnerabilities: number
    compliance: number
  }[]
}

export function SecurityMetricsChart({ data }: SecurityMetricsChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mttr"
            name="Среднее время устранения (дни)"
            stroke="#f97316"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="vulnerabilities"
            name="Количество уязвимостей"
            stroke="#ef4444"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="compliance"
            name="Соответствие требованиям (%)"
            stroke="#22c55e"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
