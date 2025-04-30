"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WaterfallChartProps {
  data?: Array<{
    name: string
    value: number
    isTotal?: boolean
  }>
  title?: string
  description?: string
  className?: string
  positiveColor?: string
  negativeColor?: string
  totalColor?: string
}

export function WaterfallChart({
  data = defaultData,
  title = "Waterfall Chart",
  description = "Breakdown of contributing factors",
  className,
  positiveColor = "#16a34a",
  negativeColor = "#e11d48",
  totalColor = "#2563eb"
}: WaterfallChartProps) {
  // Process data to calculate the running total for each item
  const processedData = data.map((item, index, array) => {
    if (item.isTotal) {
      // For total bars, we don't need to calculate anything
      return {
        ...item,
        start: 0,
        end: item.value,
        color: totalColor
      }
    }

    // Calculate the running total up to this point
    let runningTotal = 0
    for (let i = 0; i < index; i++) {
      if (!array[i].isTotal) {
        runningTotal += array[i].value
      }
    }

    return {
      ...item,
      start: runningTotal,
      end: runningTotal + item.value,
      color: item.value >= 0 ? positiveColor : negativeColor
    }
  })

  // Find the minimum and maximum values for the y-axis
  const allValues = processedData.flatMap(item => [item.start, item.end])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const yAxisDomain = [minValue < 0 ? minValue * 1.1 : 0, maxValue * 1.1]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.isTotal ? "Total: " : "Impact: "}
            <span className={data.value >= 0 ? "text-green-600" : "text-red-600"}>
              {data.value >= 0 ? "+" : ""}{data.value}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={yAxisDomain}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#888" />
              <Bar
                dataKey="value"
                fill="#8884d8"
                stackId="stack"
                radius={[4, 4, 0, 0]}
                // Custom fill based on value
                // fill={(entry) => entry.color}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { name: "Starting Value", value: 1000 },
  { name: "Revenue", value: 500 },
  { name: "Costs", value: -300 },
  { name: "Investments", value: 200 },
  { name: "Taxes", value: -150 },
  { name: "Final Value", value: 1250, isTotal: true }
]
