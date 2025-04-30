"use client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import React, { useState } from "react"
import { use } from "react"   
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompanyDashboard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Распаковываем params как Promise
  const { id: companyId } = use(params)

  const company = getCompanyData(companyId)
  const [activeTab, setActiveTab] = useState("financial")

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Компания не найдена</h1>
        <Link href="/">
          <Button>Вернуться к поиску</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      <Link href="/" className="fixed bottom-8 right-8 z-10">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg transition-transform hover:scale-110">
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Назад к поиску</span>
        </Button>
      </Link>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">{company.name}</h1>
          <p className="text-muted-foreground">ИНН: {company.taxId}</p>
        </div>

        <Card className={`mb-8 overflow-hidden`}>
          <div
            className={`${company.approved ? "bg-gradient-to-r from-green-500/20 to-green-500/5" : "bg-gradient-to-r from-red-500/20 to-red-500/5"}`}
          >
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                  <h2 className="text-2xl font-medium mb-2">Решение по кредиту</h2>
                  <div className={`text-5xl font-bold ${company.approved ? "text-green-500" : "text-red-500"}`}>
                    {company.approved ? "ОДОБРЕНО" : "ОТКАЗАНО"}
                  </div>
                  <p className="text-muted-foreground mt-2">Кредитный скорринг: {company.creditScore}/100</p>
                </div>

                <div
                  className={`flex items-center justify-center w-24 h-24 rounded-full 
                  ${
                    company.approved
                      ? "bg-green-100 text-green-600 border-4 border-green-500"
                      : "bg-red-100 text-red-600 border-4 border-red-500"
                  }`}
                >
                  <div className="text-3xl font-bold">{company.creditScore}</div>
                </div>
              </div>

              <div className="w-full mt-6 pt-6 border-t">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${company.approved ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${company.creditScore}%` }}
                  ></div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Влияние факторов (%)</CardTitle>
              <CardDescription>Топ-10 наиболее значимых факторов</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={company.featureImportance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Положительное vs Отрицательное влияние</CardTitle>
              <CardDescription>Факторы, повышающие или понижающие оценку</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={company.featureImpact}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[-100, 100]} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {company.featureImpact.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? "#4ade80" : "#f87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Глобальная важность факторов</CardTitle>
              <CardDescription>Среднее абсолютное значение SHAP с доверительным интервалом</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={company.globalImportance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="financial">Финансы</TabsTrigger>
            <TabsTrigger value="arbitration">Арбитраж</TabsTrigger>
            <TabsTrigger value="enforcement">Исполнительные производства</TabsTrigger>
            <TabsTrigger value="detailed">Детальный анализ</TabsTrigger>
            <TabsTrigger value="contracts">Контракты</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Структура выручки и активов</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Выручка", value: company.financial.revenue },
                        { name: "Активы", value: company.financial.assets },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                  <CardTitle>Показатели рентабельности</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Рентабельность прибыли", value: company.financial.profitMargin },
                        { name: "Валовая рентабельность", value: company.financial.grossMargin },
                        { name: "Рентабельность по EBITDA", value: company.financial.ebitdaMargin },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

              <Card>
                <CardHeader>
                  <CardTitle>Долговая нагрузка и ликвидность</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={company.financial.debtMetrics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="netDebt" stroke="#8884d8" />
                      <Line yAxisId="left" type="monotone" dataKey="debtEbitda" stroke="#82ca9d" />
                      <Line yAxisId="right" type="monotone" dataKey="currentRatio" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Операционный денежный поток vs Долг</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Операционный денежный поток", value: company.financial.cashflowOper },
                        { name: "Отношение CF к долгу", value: company.financial.cfOpToDebt * 100 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            </div>
          </TabsContent>

          <TabsContent value="arbitration" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Арбитражные дела по времени</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={company.arbitration.timeSeries}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
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
                  <CardTitle>Доля истца vs ответчика</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Как истец", value: company.arbitration.casesPlaintiff },
                          { name: "Как ответчик", value: company.arbitration.casesDefendant },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
          </TabsContent>

          <TabsContent value="enforcement" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Категории исполнительных производств</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Налоги", value: company.enforcement.taxCnt },
                          { name: "Кредиты", value: company.enforcement.creditCnt },
                          { name: "Прочие", value: company.enforcement.otherCnt },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
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
                  <CardTitle>Динамика взыскания</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Взыскание долга",
                          total: company.enforcement.debtSumTotal,
                          paid: company.enforcement.debtSumTotal * company.enforcement.paidShare,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" stackId="a" fill="#f87171" name="Общий долг" />
                      <Bar dataKey="paid" stackId="a" fill="#4ade80" name="Погашено" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-анализ кредитоспособности</CardTitle>
                <CardDescription>Комплексная оценка на основе финансовых и операционных данных</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-medium mb-4">Ключевые выводы</h3>
                  <div className="space-y-4">
                    <p>
                      {company.approved
                        ? "Эта компания демонстрирует крепкое финансовое здоровье с положительной динамикой ключевых показателей. Отношение долга к EBITDA в 0.9 за последний квартал особенно благоприятно, указывая на хорошую способность управлять долгом."
                        : "Эта компания показывает тревожные финансовые индикаторы, особенно высокое отношение долга к EBITDA в 5.1 за последний квартал, что свидетельствует о потенциальных трудностях с обслуживанием текущих долговых обязательств."}
                    </p>
                    <p>
                      {company.approved
                        ? "Показатели рентабельности устойчивы с маржой EBITDA 24.8%, что ставит компанию в верхний квартиль для своей отрасли. Последовательное сокращение чистого долга за последние четыре квартала демонстрирует эффективное финансовое управление."
                        : "Показатели рентабельности ниже средних по отрасли с маржой EBITDA всего 14.3%. Растущая тенденция чистого долга за последние четыре квартала вызывает опасения относительно финансовой стабильности."}
                    </p>
                    <p>
                      {company.approved
                        ? "Профиль судебных разбирательств компании минимален, большинство дел закрыто, с большей долей в качестве истца, чем ответчика. Это свидетельствует о сильной деловой практике и исполнении контрактов."
                        : "Большое количество арбитражных дел (8 за последние 12 месяцев), из которых 5 все еще открыты, представляет значительный риск условных обязательств. Преобладание позиции ответчика (7 против 2 в качестве истца) указывает на потенциальные операционные или договорные проблемы."}
                    </p>
                    <p>
                      {company.approved
                        ? "При сильном отношении операционного денежного потока к долгу в 0.65 компания демонстрирует надежную способность обслуживать долговые обязательства за счет операционной деятельности, снижая риск рефинансирования."
                        : "Низкое отношение операционного денежного потока к долгу в 0.28 указывает на потенциальные сложности с обслуживанием долга за счет операционной деятельности, увеличивая риск рефинансирования."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Контракты по типам</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "44-ФЗ", value: company.contracts.cnt44fz },
                        { name: "223-ФЗ", value: company.contracts.cnt223fz },
                        { name: "94-ФЗ", value: company.contracts.cnt94fz },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                  <CardTitle>Суммы контрактов</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Всего", value: company.contracts.sumPriceTotal },
                        { name: "Активные", value: company.contracts.sumActivePrice },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

              <Card>
                <CardHeader>
                  <CardTitle>Концентрация на топ-клиенте</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold">{(company.contracts.topCustomerShare * 100).toFixed(1)}%</div>
                  <p className="text-muted-foreground mt-4">Доля выручки от крупнейшего клиента</p>
                  <div className="w-full mt-8">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div
                        className="bg-primary h-4 rounded-full"
                        style={{ width: `${company.contracts.topCustomerShare * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Моковая функция для получения данных компании
function getCompanyData(id: string) {
  // В реальности здесь был бы запрос к API
  const companies = {
    "1": {
      id: "1",
      name: "TechInnovate LLC",
      taxId: "7707083893",
      approved: true,
      creditScore: 82,
      companyAgeYears: 7,
      numEmployees: 120,

      featureImportance: [
        { name: "Долг к EBITDA", value: 92 },
        { name: "Рентабельность прибыли", value: 85 },
        { name: "Лет на рынке", value: 78 },
        { name: "Арбитражные дела", value: 72 },
        { name: "Коэффициент текущей ликвидности", value: 65 },
        { name: "Рост выручки", value: 58 },
        { name: "Налоговые взыскания", value: 52 },
        { name: "Сумма контрактов", value: 45 },
        { name: "Количество сотрудников", value: 38 },
        { name: "Риск отрасли", value: 32 },
      ],

      featureImpact: [
        { name: "Рентабельность прибыли", value: 65 },
        { name: "Лет на рынке", value: 45 },
        { name: "Коэффициент текущей ликвидности", value: 38 },
        { name: "Рост выручки", value: 25 },
        { name: "Количество сотрудников", value: 15 },
        { name: "Риск отрасли", value: -12 },
        { name: "Арбитражные дела", value: -22 },
        { name: "Налоговые взыскания", value: -35 },
        { name: "Долг к EBITDA", value: -48 },
        { name: "Сумма контрактов", value: -18 },
      ],

      globalImportance: [
        { name: "Долг к EBITDA", value: 0.85, error: 0.05 },
        { name: "Рентабельность прибыли", value: 0.78, error: 0.06 },
        { name: "Лет на рынке", value: 0.72, error: 0.04 },
        { name: "Арбитражные дела", value: 0.65, error: 0.07 },
        { name: "Коэффициент текущей ликвидности", value: 0.58, error: 0.05 },
        { name: "Рост выручки", value: 0.52, error: 0.06 },
        { name: "Налоговые взыскания", value: 0.45, error: 0.04 },
        { name: "Сумма контрактов", value: 0.38, error: 0.05 },
        { name: "Количество сотрудников", value: 0.32, error: 0.03 },
        { name: "Риск отрасли", value: 0.25, error: 0.04 },
      ],

      financial: {
        revenue: 15000000,
        assets: 12500000,
        profitMargin: 18.5,
        grossMargin: 42.3,
        ebitdaMargin: 24.8,
        cashflowOper: 3200000,
        cfOpToDebt: 0.65,
        debtMetrics: [
          { name: "Q1", netDebt: 4500000, debtEbitda: 1.2, currentRatio: 1.8 },
          { name: "Q2", netDebt: 4200000, debtEbitda: 1.1, currentRatio: 1.9 },
          { name: "Q3", netDebt: 3800000, debtEbitda: 1.0, currentRatio: 2.0 },
          { name: "Q4", netDebt: 3500000, debtEbitda: 0.9, currentRatio: 2.1 },
        ],
      },

      arbitration: {
        casesLast12m: 3,
        openCasesCnt: 1,
        casesDefendant: 2,
        casesPlaintiff: 5,
        claimsSumTotal: 850000,
        timeSeries: [
          { period: "Янв", cases: 1, openCases: 1, claimsSum: 250000 },
          { period: "Апр", cases: 2, openCases: 1, claimsSum: 350000 },
          { period: "Июл", cases: 1, openCases: 0, claimsSum: 150000 },
          { period: "Окт", cases: 1, openCases: 0, claimsSum: 100000 },
        ],
      },

      enforcement: {
        taxCnt: 1,
        creditCnt: 2,
        otherCnt: 3,
        debtSumTotal: 750000,
        paidShare: 0.85,
      },

      industryComparison: [
        { age: 5, employees: 80 },
        { age: 6, employees: 95 },
        { age: 8, employees: 150 },
        { age: 10, employees: 200 },
        { age: 4, employees: 65 },
      ],

      contracts: {
        cnt44fz: 12,
        cnt223fz: 8,
        cnt94fz: 3,
        sumPriceTotal: 8500000,
        sumActivePrice: 5200000,
        topCustomerShare: 0.35,
      },
    },
    "2": {
      id: "2",
      name: "EcoSolutions Co.",
      taxId: "7710140679",
      approved: false,
      creditScore: 45,
      companyAgeYears: 4,
      numEmployees: 35,

      featureImportance: [
        { name: "Долг к EBITDA", value: 95 },
        { name: "Рентабельность прибыли", value: 88 },
        { name: "Лет на рынке", value: 82 },
        { name: "Арбитражные дела", value: 75 },
        { name: "Коэффициент текущей ликвидности", value: 68 },
        { name: "Рост выручки", value: 62 },
        { name: "Налоговые взыскания", value: 55 },
        { name: "Сумма контрактов", value: 48 },
        { name: "Количество сотрудников", value: 42 },
        { name: "Риск отрасли", value: 35 },
      ],

      featureImpact: [
        { name: "Рост выручки", value: 28 },
        { name: "Риск отрасли", value: 15 },
        { name: "Количество сотрудников", value: 10 },
        { name: "Лет на рынке", value: -25 },
        { name: "Коэффициент текущей ликвидности", value: -32 },
        { name: "Рентабельность прибыли", value: -45 },
        { name: "Арбитражные дела", value: -52 },
        { name: "Налоговые взыскания", value: -58 },
        { name: "Долг к EBITDA", value: -72 },
        { name: "Сумма контрактов", value: -38 },
      ],

      globalImportance: [
        { name: "Долг к EBITDA", value: 0.88, error: 0.06 },
        { name: "Рентабельность прибыли", value: 0.82, error: 0.05 },
        { name: "Лет на рынке", value: 0.75, error: 0.04 },
        { name: "Арбитражные дела", value: 0.68, error: 0.07 },
        { name: "Коэффициент текущей ликвидности", value: 0.62, error: 0.05 },
        { name: "Рост выручки", value: 0.55, error: 0.06 },
        { name: "Налоговые взыскания", value: 0.48, error: 0.04 },
        { name: "Сумма контрактов", value: 0.42, error: 0.05 },
        { name: "Количество сотрудников", value: 0.35, error: 0.03 },
        { name: "Риск отрасли", value: 0.28, error: 0.04 },
      ],

      financial: {
        revenue: 4500000,
        assets: 3800000,
        profitMargin: 8.2,
        grossMargin: 32.5,
        ebitdaMargin: 14.3,
        cashflowOper: 850000,
        cfOpToDebt: 0.28,
        debtMetrics: [
          { name: "Q1", netDebt: 3200000, debtEbitda: 4.2, currentRatio: 0.9 },
          { name: "Q2", netDebt: 3400000, debtEbitda: 4.5, currentRatio: 0.8 },
          { name: "Q3", netDebt: 3600000, debtEbitda: 4.8, currentRatio: 0.8 },
          { name: "Q4", netDebt: 3800000, debtEbitda: 5.1, currentRatio: 0.7 },
        ],
      },

      arbitration: {
        casesLast12m: 8,
        openCasesCnt: 5,
        casesDefendant: 7,
        casesPlaintiff: 2,
        claimsSumTotal: 1850000,
        timeSeries: [
          { period: "Янв", cases: 2, openCases: 2, claimsSum: 450000 },
          { period: "Апр", cases: 3, openCases: 3, claimsSum: 650000 },
          { period: "Июл", cases: 2, openCases: 1, claimsSum: 450000 },
          { period: "Окт", cases: 1, openCases: 0, claimsSum: 300000 },
        ],
      },

      enforcement: {
        taxCnt: 4,
        creditCnt: 5,
        otherCnt: 2,
        debtSumTotal: 1250000,
        paidShare: 0.35,
      },

      industryComparison: [
        { age: 3, employees: 25 },
        { age: 5, employees: 40 },
        { age: 6, employees: 55 },
        { age: 8, employees: 85 },
        { age: 2, employees: 15 },
      ],

      contracts: {
        cnt44fz: 5,
        cnt223fz: 3,
        cnt94fz: 1,
        sumPriceTotal: 3200000,
        sumActivePrice: 1800000,
        topCustomerShare: 0.65,
      },
    },
  }

  return companies[id as keyof typeof companies]
}