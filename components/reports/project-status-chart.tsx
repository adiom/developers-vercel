"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ProjectStatusChartProps {
  data: {
    status: string
    count: number
  }[]
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  // Преобразуем данные для графика
  const chartData = data.map((item) => ({
    name: item.status,
    value: Number(item.count),
  }))

  // Цвета для разных статусов
  const COLORS = {
    pending: "#eab308",
    "in progress": "#3b82f6",
    completed: "#22c55e",
    "on hold": "#94a3b8",
  }

  // Русские названия для статусов
  const STATUS_NAMES = {
    pending: "Ожидает",
    "in progress": "В процессе",
    completed: "Завершен",
    "on hold": "Приостановлен",
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={({ name }) => STATUS_NAMES[name] || name}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, STATUS_NAMES[name] || name]}
            contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }}
          />
          <Legend formatter={(value) => STATUS_NAMES[value] || value} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
