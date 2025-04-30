"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ArbitrationChartProps {
  data?: Array<{
    stage: string
    count: number
    resolved: number
  }>
  title?: string
  description?: string
  className?: string
}

export function ArbitrationChart({
  data = defaultData,
  title = "Arbitration Proceedings",
  description = "Status of legal and arbitration cases by stage",
  className,
}: ArbitrationChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow)",
                  backgroundColor: "hsl(var(--background))",
                }}
              />
              <Legend />
              <Bar name="Active Cases" dataKey="count" fill="#e11d48" />
              <Bar name="Resolved" dataKey="resolved" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="font-medium">Total Active Cases</span>
            <span className="text-lg font-bold text-red-600">{data.reduce((sum, item) => sum + item.count, 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Total Resolved</span>
            <span className="text-lg font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.resolved, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { stage: "Filing", count: 8, resolved: 12 },
  { stage: "Discovery", count: 12, resolved: 8 },
  { stage: "Hearing", count: 5, resolved: 4 },
  { stage: "Decision", count: 2, resolved: 7 },
  { stage: "Appeal", count: 3, resolved: 2 },
]
