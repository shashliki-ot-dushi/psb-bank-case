"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Grid2X2, List, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Фиктивная функция поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Симуляция API-запроса с таймаутом
    setTimeout(() => {
      setSearchResults(
        mockCompanies.filter(
          (company) =>
            company.taxId.includes(searchQuery) ||
            company.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
      setIsSearching(false)
    }, 500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-xl flex flex-col items-center justify-center mb-12">
          <h1 className="text-3xl font-semibold mb-8 text-center">
            Интеллектуальный скоринговый ассистент
          </h1>

          <form onSubmit={handleSearch} className="w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск по ИНН..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-14 text-center text-lg rounded-xl"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                disabled={isSearching}
              >
                {isSearching ? "Идет поиск..." : "Поиск"}
              </Button>
            </div>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">
                Найдено {searchResults.length} компаний
              </h2>
              <div className="flex space-x-2">
                <Toggle
                  pressed={viewMode === "list"}
                  onPressedChange={() => setViewMode("list")}
                  aria-label="Вид списком"
                >
                  <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={viewMode === "grid"}
                  onPressedChange={() => setViewMode("grid")}
                  aria-label="Вид сеткой"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Toggle>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col space-y-4"
              }
            >
              {searchResults.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

interface Company {
  id: string
  name: string
  taxId: string
  status: "Активная" | "Ликвидирована"
  capital: number
  yearsOnMarket: number
  industry: string
}

const CompanyCard = ({
  company,
  viewMode,
}: {
  company: Company
  viewMode: "grid" | "list"
}) => {
  return (
    <Card className={viewMode === "list" ? "overflow-hidden" : ""}>
      <CardContent
        className={`p-6 ${
          viewMode === "list" ? "flex justify-between items-center" : ""
        }`}
      >
        <div className={viewMode === "list" ? "flex-1" : ""}>
          <div
            className={`flex justify-between items-start mb-2 ${
              viewMode === "list" ? "items-center" : ""
            }`}
          >
            <h3 className="font-medium truncate">{company.name}</h3>
            <Badge
              className={
                company.status === "Активная" ? "bg-green-500" : "bg-red-500"
              }
            >
              {company.status}
            </Badge>
          </div>

          <div
            className={`text-sm text-muted-foreground ${
              viewMode === "list" ? "flex gap-4" : "space-y-1"
            }`}
          >
            <p>Капитал: ₽{company.capital.toLocaleString()}</p>
            <p>Лет на рынке: {company.yearsOnMarket}</p>
            <p>Отрасль: {company.industry}</p>
          </div>
        </div>

        {viewMode === "list" && (
          <Link href={`/company/${company.id}`}>
            <Button>Анализ</Button>
          </Link>
        )}
      </CardContent>

      {viewMode === "grid" && (
        <CardFooter className="p-6 pt-0 flex justify-end">
          <Link href={`/company/${company.id}`}>
            <Button>Анализ</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

// Мок-данные
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechInnovate LLC",
    taxId: "7707083893",
    status: "Активная",
    capital: 15000000,
    yearsOnMarket: 7,
    industry: "Технологии",
  },
  {
    id: "2",
    name: "EcoSolutions Co.",
    taxId: "7710140679",
    status: "Активная",
    capital: 8500000,
    yearsOnMarket: 4,
    industry: "Экологические услуги",
  },
  {
    id: "3",
    name: "MediHealth Systems",
    taxId: "7725604637",
    status: "Активная",
    capital: 22000000,
    yearsOnMarket: 12,
    industry: "Здравоохранение",
  },
  {
    id: "4",
    name: "FinServe Group",
    taxId: "7702070139",
    status: "Ликвидирована",
    capital: 5000000,
    yearsOnMarket: 3,
    industry: "Финансовые услуги",
  },
  {
    id: "5",
    name: "ConstructPro Industries",
    taxId: "7705051102",
    status: "Активная",
    capital: 35000000,
    yearsOnMarket: 15,
    industry: "Строительство",
  },
  {
    id: "6",
    name: "LogiTrans Shipping",
    taxId: "7714175986",
    status: "Активная",
    capital: 18000000,
    yearsOnMarket: 9,
    industry: "Логистика",
  },
]