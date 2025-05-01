"use client"
import React from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EnforcementData {
  enf_cases_total?: number
  enf_credit_cnt?: number
  enf_debt_sum_total?: number
  enf_paid_share?: number
  [key: string]: any
}

export default function EnforcementTabContent({
  data = {},
}: {
  data?: EnforcementData
}) {
  // Provide defaults to avoid undefined
  const {
    enf_cases_total = 0,
    enf_credit_cnt = 0,
    enf_debt_sum_total = 0,
    enf_paid_share = 0,
  } = data

  // Calculate other values safely
  const otherCases = enf_cases_total - enf_credit_cnt
  const paidAmount = enf_paid_share * enf_debt_sum_total

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Категории ИП</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Налоги", value: enf_cases_total },
                  { name: "Кредиты", value: enf_credit_cnt },
                  { name: "Прочие", value: otherCases },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#f87171" />
                <Cell fill="#fbbf24" />
                <Cell fill="#60a5fa" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Взыскание долга</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                {
                  name: "Взыскано",
                  total: enf_debt_sum_total,
                  paid: paidAmount,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" stackId="a" fill="#f87171" name="Общий" />
              <Bar dataKey="paid" stackId="a" fill="#4ade80" name="Погашено" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}