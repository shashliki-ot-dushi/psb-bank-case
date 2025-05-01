"use client"
import React from "react"
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  data: { name: string; value: number }[]
}

export default function FeatureImportanceChart({ data }: Props) {
  const shapTop10 = Object.entries(data)
  .map(([name, v]) => ({ name, value: Math.abs(v) * 100 }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Влияние факторов (%)</CardTitle>
        <CardDescription>Топ‑10</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer>
          <BarChart data={shapTop10} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}