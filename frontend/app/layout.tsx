import "./globals.css"  
import React from "react"

export default async function RootLayout(
  {
    children,
    params,
  }: Readonly<{
    children: React.ReactNode
    // Next.js 15 now passes params as a Promise
    params: Promise<{ locale: string }>
  }>
) {
  // 1. await the params promise
  const { locale } = await params

  // 2. now you can use locale freely
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}