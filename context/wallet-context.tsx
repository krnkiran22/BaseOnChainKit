"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useWalletContext as useOnchainWalletContext } from "@coinbase/onchainkit/wallet"

interface WalletContextType {
  isConnected: boolean
  address: string | null
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
})

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useOnchainWalletContext()

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  return useContext(WalletContext)
}

