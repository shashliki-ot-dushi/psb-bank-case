"use client"

import { useState } from "react"
import { BadgeDollarSign, Building, Grid3X3, LayoutDashboard, List, Search } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Mock company data
const companiesData = [
  {
    id: "acme-inc",
    name: "Acme Inc",
    industry: "Технологии",
    years: 7,
    revenue: "$4.2M",
    status: "active",
  },
  {
    id: "globex",
    name: "Globex Corporation",
    industry: "Производство",
    years: 3,
    revenue: "$2.8M",
    status: "liquidated",
  },
  {
    id: "stark-industries",
    name: "Stark Industries",
    industry: "Оборона",
    years: 12,
    revenue: "$8.7M",
    status: "active",
  },
  {
    id: "wayne-enterprises",
    name: "Wayne Enterprises",
    industry: "Многоотраслевой",
    years: 25,
    revenue: "$12.4M",
    status: "restructuring",
  },
  {
    id: "oscorp",
    name: "Oscorp Industries",
    industry: "Биотехнологии",
    years: 8,
    revenue: "$3.9M",
    status: "liquidated",
  },
  {
    id: "umbrella-corp",
    name: "Umbrella Corporation",
    industry: "Фармацевтика",
    years: 15,
    revenue: "$7.2M",
    status: "restructuring",
  },
  {
    id: "cyberdyne",
    name: "Cyberdyne Systems",
    industry: "Робототехника",
    years: 5,
    revenue: "$2.1M",
    status: "active",
  },
  {
    id: "initech",
    name: "Initech",
    industry: "Программное обеспечение",
    years: 4,
    revenue: "$1.8M",
    status: "restructuring",
  },
]

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")

  // Filter companies based on search query
  const filteredCompanies = companiesData.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Перевод статусов компаний
  const translateStatus = (status) => {
    switch (status) {
      case "active":
        return "Активна"
      case "liquidated":
        return "Ликвидирована"
      case "restructuring":
        return "Реструктуризация"
      default:
        return status
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link className="lg:hidden" href="#">
            <BadgeDollarSign className="h-6 w-6" />
            <span className="sr-only">Главная</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Компании</h1>
          </div>
          <Link href="/dashboard" className="lg:hidden">
            <LayoutDashboard className="h-5 w-5" />
          </Link>
        </header>
        <main className="p-4 md:p-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Поиск</h1>
            <div className="relative w-full max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск компаний..."
                className="w-full h-12 pl-12 pr-4 text-lg rounded-full border-2 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                <ToggleGroupItem value="list" aria-label="Просмотр списком">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Просмотр сеткой">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Companies List/Grid */}
          {viewMode === "grid" ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={company.name} />
                        <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Badge
                        className={
                          company.status === "active"
                            ? "bg-green-600"
                            : company.status === "liquidated"
                              ? "bg-destructive"
                              : "bg-amber-500"
                        }
                      >
                        {translateStatus(company.status)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{company.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Отрасль:</span>
                        <span className="text-sm font-medium">{company.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Количество лет на рынке:</span>
                        <span className="text-sm font-medium">{company.years}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Капитал:</span>
                        <span className="text-sm font-medium">{company.revenue}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/dashboard?company=${company.id}`}>Анализировать</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id}>
                  <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={company.name} />
                        <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.industry}, {company.years} лет
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-0 sm:ml-auto">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Капитал</span>
                        <span className="font-medium">{company.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            company.status === "active"
                              ? "bg-green-600"
                              : company.status === "liquidated"
                                ? "bg-destructive"
                                : "bg-amber-500"
                          }
                        >
                          {translateStatus(company.status)}
                        </Badge>
                        <Button asChild size="sm">
                          <Link href={`/dashboard?company=${company.id}`}>Анализировать</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredCompanies.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <Building className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Компании не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}