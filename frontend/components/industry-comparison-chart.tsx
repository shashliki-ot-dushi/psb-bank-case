"use client"

import { Tooltip } from "@/components/ui/tooltip"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

interface IndustryComparisonChartProps {
  data?: Array<{
    metric: string
    company: number
    industry: number
  }>
  title?: string
  description?: string
  className?: string
}

export function IndustryComparisonChart({
  data = defaultData,
  title = "Industry Comparison",
  description = "Company metrics compared to industry averages",
  className,
}: IndustryComparisonChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Your Company" dataKey="company" stroke="#2563eb" fill="#3b82f680" fillOpacity={0.6} />
              <Radar name="Industry Average" dataKey="industry" stroke="#e11d48" fill="#e11d4880" fillOpacity={0.6} />
              <Legend />
              {/* <Tooltip
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow)",
                  backgroundColor: "hsl(var(--background))",
                }}
              /> */}
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm">
          <p className="font-medium">Performance Summary</p>
          <p className="text-muted-foreground">
            Your company outperforms the industry average in{" "}
            {data.filter((item) => item.company > item.industry).length} out of {data.length} key metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { metric: "Revenue Growth", company: 85, industry: 65 },
  { metric: "Profit Margin", company: 70, industry: 60 },
  { metric: "Debt Ratio", company: 45, industry: 60 },
  { metric: "Market Share", company: 55, industry: 50 },
  { metric: "Employee Growth", company: 80, industry: 45 },
  { metric: "Innovation", company: 90, industry: 70 },
]
