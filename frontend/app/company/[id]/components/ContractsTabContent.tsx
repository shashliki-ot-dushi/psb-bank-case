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

interface ContractsData {
  cnt_44fz?: number
  cnt_223fz?: number
  cnt_94fz?: number
  sumAmount?: number
  topCustomerShare?: number
}

export default function ContractsTabContent({
  data = {},
}: {
  data?: ContractsData
}) {
  // Provide defaults to avoid undefined
  const {
    cnt_44fz = 0,
    cnt_223fz = 0,
    cnt_94fz = 0,
    sumAmount = 0,
    topCustomerShare = 0,
  } = data

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>По типам</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: "44‑ФЗ", value: cnt_44fz },
                { name: "223‑ФЗ", value: cnt_223fz },
                { name: "94‑ФЗ", value: cnt_94fz },
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

      <Card>
        <CardHeader>
          <CardTitle>Общая сумма</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-2xl">
          {new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
          }).format(sumAmount)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Доля крупного заказчика</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-2xl">
          {(topCustomerShare * 100).toFixed(1)}%
        </CardContent>
      </Card>
    </div>
  )
}