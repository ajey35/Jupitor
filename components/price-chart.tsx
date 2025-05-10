"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { Token } from "@/types/token"

interface PriceDataPoint {
  time: string
  price: number
}

const timeRanges = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
]

export function PriceChart({
  baseToken,
  quoteToken,
}: {
  baseToken: Token
  quoteToken: Token
}) {
  const [timeRange, setTimeRange] = useState("24h")
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, fetch from an API   //// Implement the Real Data and Render here!
        // For demo, generate random price data
        const now = new Date()
        const data: PriceDataPoint[] = []
        const points = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30

        let basePrice = 143.2 // Starting price (USDC/SOL)

        for (let i = points; i >= 0; i--) {
          const time = new Date(now)
          time.setHours(time.getHours() - (timeRange === "24h" ? i : 0))
          time.setDate(time.getDate() - (timeRange === "7d" ? i : timeRange === "30d" ? i : 0))

          // Add some random price movement
          const change = (Math.random() - 0.5) * 0.1
          basePrice = basePrice * (1 + change)

          data.push({
            time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price: basePrice,
          })
        }

        setPriceData(data)
      } catch (error) {
        console.error("Failed to fetch price data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [baseToken, quoteToken, timeRange])

  // Calculate price change
  const priceChange =
    priceData.length >= 2
      ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100
      : 0

  return (
    <div className="bg-secondary/10 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-sm font-medium">
            {quoteToken.symbol}/{baseToken.symbol}
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium">
              {priceData.length > 0 ? priceData[priceData.length - 1].price.toFixed(2) : "-"}
            </span>
            <span className={`ml-2 ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          {timeRanges.map(({ label, value }) => (
            <button
              key={value}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === value ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"
              }`}
              onClick={() => setTimeRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[150px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                dot={false}
                stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
