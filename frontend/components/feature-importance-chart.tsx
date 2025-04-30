"use client"

import { Chart, ChartLegend, ChartLegendItem, ChartPie } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureImportanceChartProps {
  data?: Array<{
    name: string
    value: number
    color: string
  }>
  title?: string
  description?: string
  className?: string
}

export function FeatureImportanceChart({
  data = defaultData,
  title = "Feature Importance",
  description = "Factors influencing the loan decision",
  className,
}: FeatureImportanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <Chart className="h-full w-full">
            <ChartPie
              data={data}
              category="value"
              index="name"
              valueFormatter={(value) => `${value}%`}
              className="h-full w-full"
              colors={data.map((item) => item.color)}
            />
          </Chart>
        </div>
        <ChartLegend className="mt-3 justify-center gap-4">
          {data.map((item, index) => (
            <ChartLegendItem key={index} color={item.color}>
              {item.name} ({item.value}%)
            </ChartLegendItem>
          ))}
        </ChartLegend>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { name: "Credit Score", value: 35, color: "#2563eb" },
  { name: "Income", value: 25, color: "#7c3aed" },
  { name: "Employment History", value: 20, color: "#db2777" },
  { name: "Debt-to-Income", value: 15, color: "#ea580c" },
  { name: "Loan Amount", value: 5, color: "#16a34a" },
]
