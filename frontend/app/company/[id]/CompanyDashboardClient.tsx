"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getCompanyData, CompanyData } from "./getCompanyData"
import CreditDecisionCard from "./components/CreditDecisionCard"
import FeatureImportanceChart from "./components/FeatureImportanceChart"
import FeatureImpactChart from "./components/FeatureImpactChart"
import FinancialTabContent from "./components/FinancialTabContent"
import ArbitrationTabContent from "./components/ArbitrationTabContent"
import EnforcementTabContent from "./components/EnforcementTabContent"
import DetailedAnalysisTabContent from "./components/DetailedAnalysisTabContent"
import ContractsTabContent from "./components/ContractsTabContent"

export default function CompanyDashboardClient({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("financial")
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    getCompanyData(companyId)
      .then(data => {
        setCompany(data)
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        setCompany(null)
      })
      .finally(() => setLoading(false))
  }, [companyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Загрузка…
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">{error || "Не удалось загрузить данные"}</p>
        <Button onClick={() => router.push("/")}>К поиску</Button>
      </div>
    )
  }

  // Дефолтные пустые массивы, если какая-то часть данных отсутствует
  const {
    featureImportance = [],
    featureImpact = [],
    globalImportance = [],
    financial,
    arbitration,
    enforcement,
    contracts,
    approved,
    creditScore,
    name,
    taxId,
  } = company

  // Преобразуем в массив [{name, value}, …], умножаем на 100 для процентов, сортируем и берем топ‑10

  const rawInfluencers: Record<string, number> = company.key_influencers[0] || {}

  // 3. impactData — топ‑10 с учётом знака (плюс/минус)
  const impactData = Object.entries(rawInfluencers)
    .map(([name, val]) => ({ name, value: val * 100 }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 10)

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Link href="/" className="fixed bottom-8 right-8 z-10">
        <Button size="icon" className="rounded-full">
          <ChevronLeft />
          <span className="sr-only">Назад</span>
        </Button>
      </Link>


      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">{name}</h1>
          <p className="text-muted-foreground">ИНН: {company.statsAll.general.inn}</p>
        </header>

        <CreditDecisionCard approved={company.verdict} creditScore={100 - Math.round(company.score * 100)} />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FeatureImportanceChart data={company.key_influencers[0]} />
          <FeatureImpactChart data={impactData} />
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="financial">Финансы</TabsTrigger>
            <TabsTrigger value="arbitration">Арбитраж</TabsTrigger>
            <TabsTrigger value="enforcement">Исполнительные</TabsTrigger>
            <TabsTrigger value="detailed">Детальный</TabsTrigger>
            <TabsTrigger value="contracts">Контракты</TabsTrigger>
          </TabsList>

          <TabsContent value="financial">
            <FinancialTabContent data={company.statsAll.financial} />
          </TabsContent>
          <TabsContent value="arbitration">
            <ArbitrationTabContent data={company.statsAll.arbitration} />
          </TabsContent>
          <TabsContent value="enforcement">
            <EnforcementTabContent data={company.statsAll.enforcement} />
          </TabsContent>
          <TabsContent value="detailed">
            <DetailedAnalysisTabContent company={company} />
          </TabsContent>
          <TabsContent value="contracts">
            <ContractsTabContent data={company.statsAll.contracts} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}