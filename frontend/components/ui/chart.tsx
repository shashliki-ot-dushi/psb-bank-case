"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full h-[200px]", className)} {...props} />
))
Chart.displayName = "Chart"

interface ChartPieProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  category: string
  colors?: string[]
  valueFormatter?: (value: number) => string
}

const ChartPie = React.forwardRef<HTMLDivElement, ChartPieProps>(
  ({ className, data, index, category, colors, valueFormatter = (value) => `${value}`, ...props }, ref) => {
    const RADIAN = Math.PI / 180
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
    }: {
      cx: number
      cy: number
      midAngle: number
      innerRadius: number
      outerRadius: number
      percent: number
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)

      return percent > 0.05 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={500}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      ) : null
    }

    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="90%"
              innerRadius="40%"
              dataKey={category}
              nameKey={index}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors ? colors[index % colors.length] : `hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => valueFormatter(value)}
              contentStyle={{
                borderRadius: "6px",
                border: "1px solid hsl(var(--border))",
                boxShadow: "var(--shadow)",
                backgroundColor: "hsl(var(--background))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  },
)
ChartPie.displayName = "ChartPie"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap items-center gap-4", className)} {...props} />
  ),
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
}

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ className, color = "currentColor", children, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 text-sm", className)} {...props}>
      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      <span>{children}</span>
    </div>
  ),
)
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartPie, ChartLegend, ChartLegendItem }
