"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track page view
      const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`
      // In a real app, you'd call your analytics service here
      console.log(`Page view: ${url}`)
    }
  }, [pathname, searchParams])

  return null
}
