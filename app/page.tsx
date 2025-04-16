import type { Metadata } from "next"
import { WalletConnect } from "@/components/wallet-connect"
import { TwitchStream } from "@/components/twitch-stream"
import { NetworkStatus } from "@/components/network-status"

export const metadata: Metadata = {
  title: "BaseTip - Simple Tipping on Base",
  description: "Send crypto tips on the Base network",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Minimal Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-bold text-xl">BaseTip</span>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Send Crypto Tips
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Easily send tips to anyone on the Base network
                </p>
                <NetworkStatus className="mt-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Tipping Section */}
        <section className="w-full pb-12 md:pb-16">
          <div className="container px-4 md:px-6 max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <TwitchStream />
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 border-t bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Base Network</p>
        </div>
      </footer>
    </div>
  )
}