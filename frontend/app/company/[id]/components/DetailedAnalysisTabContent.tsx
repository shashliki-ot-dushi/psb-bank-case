"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DetailedAnalysisTabContent({ company }: { company: any }) {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>AI‑анализ</CardTitle>
          <CardDescription>Ключевые выводы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ...generate analysis text based on company data */}
            <p>{company.approved ? "Положительная динамика..." : "Тревожные индикаторы..."}</p>
            {/* etc. */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}