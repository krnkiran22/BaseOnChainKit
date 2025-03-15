import type { ReactNode } from "react"
import "@/app/globals.css"
import "@coinbase/onchainkit/styles.css" // Add OnchainKit styles
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AccountProvider } from "@/hooks/use-account"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/app/providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Providers>
            <AccountProvider>
              {children}
              <Toaster />
            </AccountProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
