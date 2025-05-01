"use client"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  approved: boolean
  creditScore: number
}

export default function CreditDecisionCard({ approved, creditScore }: Props) {
  return (
    <Card className="mb-8 overflow-hidden">
      <div className={approved ? "bg-green-50" : "bg-red-50"}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium mb-2">Решение по кредиту</h2>
              <div className={`text-5xl font-bold ${approved ? "text-green-500" : "text-red-500"}`}>
                {approved ? "ОДОБРЕНО" : "ОТКАЗАНО"}
              </div>
              <p className="text-muted-foreground mt-2">Скоринг: {creditScore}/100</p>
            </div>
            <div className={`flex items-center justify-center w-24 h-24 rounded-full ${approved ? "bg-green-100 text-green-600 border-green-500" : "bg-red-100 text-red-600 border-red-500"}`}>
              <span className="text-3xl font-bold">{creditScore}</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="w-full bg-muted rounded-full h-3">
              <div className={`h-3 rounded-full ${approved ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${creditScore}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Высокий риск</span>
              <span>Средний риск</span>
              <span>Низкий риск</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}