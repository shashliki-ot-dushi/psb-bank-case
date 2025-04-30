"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface PercentileChartProps {
  data?: Array<{
    percentile: number
    value: number
  }>
  title?: string
  description?: string
  className?: string
}

export function PercentileChart({
  data = defaultData,
  title = "Credit Score Percentile",
  description = "Company's credit score relative to industry peers",
  className,
}: PercentileChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="percentile" 
                label={{ value: 'Percentile', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Score', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Score']}
                labelFormatter={(label) => `${label}th Percentile`}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow)",
                  backgroundColor: "hsl(var(--background))",
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                fill="#3b82f680" 
                activeDot={{ r: 8 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="flex flex-col items-center">
            <span className="font-medium">Your Score</span>
            <span className="text-lg font-bold text-blue-600">78</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">Industry Median</span>
            <span className="text-lg font-bold">65</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">Percentile</span>
            <span className="text-lg font-bold text-blue-600">85th</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { percentile: 0, value: 20 },
  { percentile: 10, value: 35 },
  { percentile: 20, value: 45 },
  { percentile: 30, value: 52 },
  { percentile: 40, value: 58 },
  { percentile: 50, value: 65 },
  { percentile: 60, value: 70 },
  { percentile: 70, value: 74 },
  { percentile: 80, value: 78 },
  { percentile: 90, value: 85 },
  { percentile: 100, value: 95 },
]
