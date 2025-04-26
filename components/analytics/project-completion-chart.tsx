"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface ProjectCompletionChartProps {
  data: {
    month: string
    всего: number
    завершено: number
  }[]
}

export function ProjectCompletionChart({ data }: ProjectCompletionChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }} />
          <Legend />
          <Bar dataKey="всего" name="Всего проектов" fill="#3b82f6" />
          <Bar dataKey="завершено" name="Завершено" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
