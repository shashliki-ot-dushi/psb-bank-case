"use client"
import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ArbitrationData {
  timeSeries?: Array<{
    period: string
    cases: number
    openCases: number
    claimsSum: number
  }>
  casesPlaintiff?: number
  casesDefendant?: number
  [key: string]: any
}

export default function ArbitrationTabContent({
  data = {},
}: {
  data?: ArbitrationData
}) {
  // Provide defaults to avoid `undefined`
  const {
    timeSeries = [],
    casesPlaintiff = 0,
    casesDefendant = 0,
  } = data

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Арбитраж по периодам</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#8884d8" />
              <Bar dataKey="openCases" fill="#82ca9d" />
              <Bar dataKey="claimsSum" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Истец vs Ответчик</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Истец", value: casesPlaintiff },
                  { name: "Ответчик", value: casesDefendant },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}