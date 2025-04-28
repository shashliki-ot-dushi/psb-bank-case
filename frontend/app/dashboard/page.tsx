"use client"

import { useState } from "react"
import { BadgeDollarSign, ChevronLeft, ThumbsDown, ThumbsUp } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Chart, ChartLegend, ChartLegendItem, ChartPie } from "@/components/ui/chart"

export default function DashboardPage() {
    const [companyId, setCompanyId] = useState("acme-inc");
    const [applicationNumber] = useState(() => Math.floor(Math.random() * 10000));

  const featureImportanceData = [
    { name: "Кредитная история", value: 35, color: "#2563eb" },
    { name: "Выручка", value: 25, color: "#16a34a" },
    { name: "Коэффициент долга", value: 20, color: "#ca8a04" },
    { name: "Стабильность рынка", value: 12, color: "#9333ea" },
    { name: "Риск отрасли", value: 8, color: "#e11d48" },
  ]

  const courtProceedingsData = [
    { name: "Нет разбирательств", value: 60, color: "#16a34a" },
    { name: "Активное дело", value: 20, color: "#ca8a04" },
    { name: "Стадия апелляции", value: 12, color: "#e11d48" },
    { name: "Разрешено", value: 8, color: "#2563eb" },
  ]

  const riskFactorsData = [
    { name: "Низкий риск", value: 45, color: "#16a34a" },
    { name: "Средний риск", value: 30, color: "#ca8a04" },
    { name: "Высокий риск", value: 25, color: "#e11d48" },
  ]

  // Mock data for company selection
  const companies = [
    { id: "acme-inc", name: "Acme Inc", decision: "approve", score: 85 },
    { id: "globex", name: "Globex Corporation", decision: "decline", score: 42 },
    { id: "stark-industries", name: "Stark Industries", decision: "approve", score: 92 },
    { id: "wayne-enterprises", name: "Wayne Enterprises", decision: "review", score: 68 },
  ]

  const selectedCompany = companies.find((company) => company.id === companyId) || companies[0]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Main content */}
      <div className="w-full">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/companies" className="flex items-center gap-1 text-sm font-medium">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
          <div className="w-full flex-1 ml-2">
            <h1 className="text-lg font-semibold">Панель управления решением о кредите</h1>
          </div>
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <BadgeDollarSign className="h-6 w-6" />
            <span>LoanWise</span>
          </Link>
        </header>
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Анализ компании</h1>
              <p className="text-muted-foreground">Просмотр деталей заявки на кредит и принятие решения</p>
            </div>
            <div className="ml-auto">
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите компанию" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Decision Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="grid gap-1">
                <CardTitle className="text-xl">{selectedCompany.name}</CardTitle>
                <CardDescription>Заявка на кредит #L-{applicationNumber}</CardDescription>
              </div>
              {selectedCompany.decision === "approve" ? (
                <Badge className="ml-auto text-sm bg-green-600">Рекомендация: Одобрено</Badge>
              ) : selectedCompany.decision === "decline" ? (
                <Badge className="ml-auto text-sm bg-destructive">Рекомендация: Отклонено</Badge>
              ) : (
                <Badge className="ml-auto text-sm bg-amber-500">Рекомендация: На рассмотрении</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Кредитный скоринг</span>
                  <span className="text-2xl font-bold">{selectedCompany.score}/100</span>
                </div>
                <Progress
                  value={selectedCompany.score}
                  className="w-1/2"
                  indicatorColor={
                    selectedCompany.score >= 70
                      ? "bg-green-600"
                      : selectedCompany.score >= 50
                        ? "bg-amber-500"
                        : "bg-destructive"
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Капитал</span>
                  <span className="text-lg">$4.2M</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Соотношение долга к доходу</span>
                  <span className="text-lg">0.42</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Отрасль</span>
                  <span className="text-lg">Технологии</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Компания существует</span>
                  <span className="text-lg">7 лет</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Полный отчет</Button>
              <div className="flex gap-2">
                <Button variant="destructive">
                  <ThumbsDown className="mr-2 h-4 w-4" /> Отклонить
                </Button>
                <Button variant="default">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Одобрить
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Importance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Важность факторов</CardTitle>
                <CardDescription>Факторы, влияющие на решение о кредите</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <Chart className="h-full w-full">
                    <ChartPie
                      data={featureImportanceData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      className="h-full w-full"
                      colors={featureImportanceData.map((item) => item.color)}
                    />
                  </Chart>
                </div>
                <ChartLegend className="mt-3 justify-center gap-4">
                  {featureImportanceData.map((item, index) => (
                    <ChartLegendItem key={index} color={item.color}>
                      {item.name} ({item.value}%)
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              </CardContent>
            </Card>

            {/* Court Proceedings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Судебные разбирательства</CardTitle>
                <CardDescription>Распределение юридических статусов компаний</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <Chart className="h-full w-full">
                    <ChartPie
                      data={courtProceedingsData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      className="h-full w-full"
                      colors={courtProceedingsData.map((item) => item.color)}
                    />
                  </Chart>
                </div>
                <ChartLegend className="mt-3 justify-center gap-4">
                  {courtProceedingsData.map((item, index) => (
                    <ChartLegendItem key={index} color={item.color}>
                      {item.name} ({item.value}%)
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Оценка рисков</CardTitle>
                <CardDescription>Общее распределение рисков</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <Chart className="h-full w-full">
                    <ChartPie
                      data={riskFactorsData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      className="h-full w-full"
                      colors={riskFactorsData.map((item) => item.color)}
                    />
                  </Chart>
                </div>
                <ChartLegend className="mt-3 justify-center gap-4">
                  {riskFactorsData.map((item, index) => (
                    <ChartLegendItem key={index} color={item.color}>
                      {item.name} ({item.value}%)
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              </CardContent>
            </Card>
          </div>

          {/* Recent applications */}
          <Card>
            <CardHeader>
              <CardTitle>Недавние заявки</CardTitle>
              <CardDescription>Обзор недавних заявок на кредит</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Acme Inc" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Acme Inc</p>
                      <p className="text-sm text-muted-foreground">Технологии, 7 лет</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="bg-green-600">Одобрено</Badge>
                    <Button variant="ghost" size="sm">
                      Просмотр
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Globex Corporation" />
                      <AvatarFallback>GC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Globex Corporation</p>
                      <p className="text-sm text-muted-foreground">Производство, 3 года</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="destructive">Отклонено</Badge>
                    <Button variant="ghost" size="sm">
                      Просмотр
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Stark Industries" />
                      <AvatarFallback>SI</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Stark Industries</p>
                      <p className="text-sm text-muted-foreground">Оборона, 12 лет</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="bg-green-600">Одобрено</Badge>
                    <Button variant="ghost" size="sm">
                      Просмотр
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Wayne Enterprises" />
                      <AvatarFallback>WE</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Wayne Enterprises</p>
                      <p className="text-sm text-muted-foreground">Многоотраслевой, 25 лет</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="bg-amber-500">На рассмотрении</Badge>
                    <Button variant="ghost" size="sm">
                      Просмотр
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}