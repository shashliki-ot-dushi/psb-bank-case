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
  arb_claims_sum_total?: number
  arb_cases_last_12m?: number
  arb_open_cases_cnt?: number
  arb_cases_defendant?: number
  arb_large_case_flag?: number
}

export default function ArbitrationTabContent({
  data = {},
}: {
  data?: ArbitrationData
}) {
  // Provide defaults to avoid `undefined`
  const {
    arb_claims_sum_total = 0,
    arb_cases_last_12m = 0,
    arb_open_cases_cnt = 0,
    arb_cases_defendant = 0,
  } = data

  // Derive plaintiff cases as total minus defendant
  const casesPlaintiff = Math.max(arb_cases_last_12m - arb_cases_defendant, 0)

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Арбитраж — основные метрики</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "За 12 мес", value: arb_cases_last_12m },
                { name: "Открытые", value: arb_open_cases_cnt },
                { name: "Сумма исков", value: arb_claims_sum_total },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={value => 
                typeof value === "number" 
                  ? new Intl.NumberFormat("ru-RU").format(value) 
                  : value
              } />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Значение" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Plaintiff vs Defendant Pie */}
      <Card>
        <CardHeader>
          <CardTitle>Истец vs Ответчик</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Истец", value: arb_open_cases_cnt - arb_cases_defendant },
                  { name: "Ответчик", value: arb_cases_defendant },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip formatter={value => 
                typeof value === "number" 
                  ? new Intl.NumberFormat("ru-RU").format(value) 
                  : value
              } />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}