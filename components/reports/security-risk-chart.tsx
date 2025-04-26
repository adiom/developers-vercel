"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface SecurityRiskChartProps {
  data: {
    severity?: string
    risk_level?: string
    count: number
  }[]
}

export function SecurityRiskChart({ data }: SecurityRiskChartProps) {
  // Преобразуем данные для графика
  const chartData = data.map((item) => ({
    name: item.severity || item.risk_level || "Неизвестно",
    value: Number(item.count),
  }))

  // Цвета для разных уровней риска
  const COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
    "Не оценено": "#94a3b8",
    Неизвестно: "#94a3b8",
  }

  // Русские названия для уровней риска
  const RISK_NAMES = {
    Critical: "Критический",
    High: "Высокий",
    Medium: "Средний",
    Low: "Низкий",
    "Не оценено": "Не оценено",
    Неизвестно: "Неизвестно",
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
            label={({ name }) => RISK_NAMES[name] || name}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, RISK_NAMES[name] || name]}
            contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }}
          />
          <Legend formatter={(value) => RISK_NAMES[value] || value} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
