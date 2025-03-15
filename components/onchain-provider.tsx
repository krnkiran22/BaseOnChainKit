"use client"

import type { ReactNode } from "react"
import { OnchainKitProvider } from "@coinbase/onchainkit"
import { base } from "wagmi/chains"

// Base Sepolia Configuration
const BASE_SEPOLIA_CHAIN_ID = 84532

// Custom Base Sepolia chain configuration
const baseSepolia = {
  id: BASE_SEPOLIA_CHAIN_ID,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Explorer",
      url: "https://sepolia-explorer.base.org",
    },
  },
  testnet: true,
}

export function OnchainProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      supportedChains={[baseSepolia, base]}
    >
      {children}
    </OnchainKitProvider>
  )
}

