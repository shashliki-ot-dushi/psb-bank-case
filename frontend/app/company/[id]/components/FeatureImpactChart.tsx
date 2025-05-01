"use client"
import React from "react"
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  data: { name: string; value: number }[]
}

export default function FeatureImpactChart({ data }: Props) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Положительное vs Отрицательное</CardTitle>
        <CardDescription>Локальный SHAP</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[-100, 100]} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((e, i) => (
                <Cell key={i} fill={e.value > 0 ? "#4ade80" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}