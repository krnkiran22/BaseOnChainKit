"use client"

import { useEffect, useState } from "react"
import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use a state to track if we're mounted on the client
  const [mounted, setMounted] = useState(false)

  // After mounting, we can render the theme provider with its effects
  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR or before hydration, render children without theme classes
  // This prevents hydration mismatch between server and client
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

