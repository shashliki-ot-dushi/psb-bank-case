"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EntityMetadataProps {
  title?: string
  description?: string
  metadata?: Array<{
    label: string
    value: string | number
  }>
  className?: string
}

export function EntityMetadata({
  title = "Entity Information",
  description = "Detailed information about the entity",
  metadata = [],
  className,
}: EntityMetadataProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              <span className="text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Default mock data
const defaultMetadata = [
  { label: "Entity Name", value: "Example Corp" },
  { label: "Industry", value: "Technology" },
  { label: "Founded", value: "2010" },
  { label: "Location", value: "United States" },
  { label: "Employees", value: "500" },
] 