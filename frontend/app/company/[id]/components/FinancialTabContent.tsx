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
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FinancialData {
  fin_rev_last?: number
  fin_assets_last?: number
  fin_profit_margin?: number
  fin_gross_margin?: number
  fin_ebitda_margin?: number
  fin_debt_ebitda?: number | null
  fin_current_ratio?: number
  fin_cashflow_oper?: number
  fin_cf_op_to_debt?: number | null
  [key: string]: any
}

export default function FinancialTabContent({
  data = {},
}: {
  data?: FinancialData
}) {
  const {
    // Первый график: Выручка и Активы
    fin_rev_last = 0,
    fin_assets_last = 0,

    // Второй график: Рентабельность
    fin_profit_margin = 0,
    fin_gross_margin = 0,
    fin_ebitda_margin = 0,

    // Третий график: Финансовая устойчивость
    fin_debt_ebitda = 0,
    fin_current_ratio = 0,

    // Четвёртый график: Денежный поток
    fin_cashflow_oper = 0,
    fin_cf_op_to_debt = 0,
  } = {
    // заменяем null на 0 для корректного рендеринга
    ...data,
    fin_debt_ebitda: data.fin_debt_ebitda ?? 0,
    fin_cf_op_to_debt: data.fin_cf_op_to_debt ?? 0,
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Выручка vs Активы */}
      <Card>
        <CardHeader>
          <CardTitle>Финансовые показатели</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "Выручка", value: fin_rev_last },
                { name: "Активы", value: fin_assets_last },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Рентабельность */}
      <Card>
        <CardHeader>
          <CardTitle>Рентабельность</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "Прибыль%", value: fin_profit_margin * 100 },
                { name: "Валовая%", value: fin_gross_margin * 100 },
                { name: "EBITDA%", value: fin_ebitda_margin * 100 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Финансовая устойчивость */}
      <Card>
        <CardHeader>
          <CardTitle>Финансовая устойчивость</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "Долговая нагрузка", value: fin_debt_ebitda },
                { name: "Ликвидность", value: fin_current_ratio },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Денежный поток */}
      <Card>
        <CardHeader>
          <CardTitle>Денежный поток</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "CF опер.", value: fin_cashflow_oper },
                { name: "CF/Debt%", value: fin_cf_op_to_debt * 100 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}