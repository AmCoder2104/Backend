"use client"

import * as React from "react"
import { Tooltip } from "recharts"

import { cn } from "@/lib/utils"

// Create a context to share the chart configuration
const ChartContext = React.createContext(null)

// Hook to use the chart configuration
export function useChartConfig() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChartConfig must be used within a ChartContainer")
  }
  return context
}

// Chart container component that provides the configuration
export function ChartContainer({ config, className, children, ...props }) {
  // Set CSS variables for the chart colors
  const style = React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    }, {})
  }, [config])

  return (
    <ChartContext.Provider value={config}>
      <div className={cn("w-full", className)} style={style} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

// Chart tooltip content component
export function ChartTooltipContent({ active, payload, label, className, formatter, labelFormatter, ...props }) {
  const config = useChartConfig()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
      {label && <div className="mb-1 font-medium">{labelFormatter ? labelFormatter(label) : label}</div>}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => {
          const dataKey = item.dataKey
          const color = config[dataKey]?.color
          const name = config[dataKey]?.label || dataKey
          const value = formatter ? formatter(item.value, name) : `${item.value}`

          return (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-muted-foreground">{name}:</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Export the recharts ChartTooltip as ChartTooltip
export { Tooltip as ChartTooltip }

