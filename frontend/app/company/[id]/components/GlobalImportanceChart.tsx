"use client"
import React from "react"
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ErrorBar } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  data: { name: string; value: number; error?: number }[]
}

export default function GlobalImportanceChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Глобальная важность</CardTitle>
        <CardDescription>Среднее |SHAP| + Δ</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              <ErrorBar dataKey="error" width={4} strokeWidth={2} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}