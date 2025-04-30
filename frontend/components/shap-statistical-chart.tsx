"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface ShapStatisticalChartProps {
  data?: Array<{
    feature: string
    shapValue: number
  }>
  title?: string
  description?: string
  className?: string
}

export function ShapStatisticalChart({
  data = defaultData,
  title = "SHAP Feature Importance",
  description = "Impact of features on the model's prediction",
  className,
}: ShapStatisticalChartProps) {
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
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="feature"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow)",
                  backgroundColor: "hsl(var(--background))",
                }}
                formatter={(value: number) => [value.toFixed(4), "SHAP Value"]}
              />
              <Bar
                dataKey="shapValue"
                fill="hsl(var(--primary))"
                fillOpacity={0.8}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm">
          <p className="font-medium">Interpretation</p>
          <p className="text-muted-foreground">
            Positive SHAP values indicate features that increase the prediction, while negative values indicate features that decrease it.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultData = [
  { feature: "Revenue Growth", shapValue: 0.15 },
  { feature: "Profit Margin", shapValue: 0.12 },
  { feature: "Debt Ratio", shapValue: -0.08 },
  { feature: "Market Share", shapValue: 0.10 },
  { feature: "Employee Growth", shapValue: 0.05 },
  { feature: "Innovation Score", shapValue: 0.18 },
] 