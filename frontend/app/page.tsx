"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const inn = searchQuery.trim()
    if (!inn) {
      setErrorMessage("Пожалуйста, введите ИНН.")
      return
    }

    setIsSearching(true)
    setErrorMessage(null)

    try {
      // Проверяем корректность ИНН по статусу ответа
      const res = await fetch(
        `http://localhost:8000/v1/stats/general?inn=${encodeURIComponent(inn)}`,
        { method: "GET" }
      )

      if (res.status === 404) {
        setErrorMessage("Компания с указанным ИНН не найдена.")
        setIsSearching(false)
        return
      }

      if (!res.ok) {
        throw new Error("Ошибка при проверке ИНН")
      }

      // Если ИНН валиден, переходим на страницу дешборда
      router.push(`/company/${encodeURIComponent(inn)}`)
    } catch (err) {
      console.error(err)
      setErrorMessage("Произошла ошибка при проверке ИНН. Попробуйте ещё раз.")
      setIsSearching(false)
    }
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
                placeholder="Введите ИНН компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-14 text-center text-lg rounded-xl"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                disabled={isSearching}
              >
                {isSearching ? "Проверка..." : "Поиск"}
              </Button>
            </div>
            {errorMessage && (
              <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}