import React from "react"
import CompanyDashboardClient from "./CompanyDashboardClient"

interface PageProps {
  // Next.js 15 dynamic params come in as a Promise
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  // 1. await the params promise
  const { id } = await params

  // 2. now you can pass `id` into your client
  return <CompanyDashboardClient companyId={id} />
}