"use client"

import { 
  Wallet, 
  ConnectWallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet'
import { 
  Identity, 
  Avatar, 
  Name, 
  Address, 
  EthBalance 
} from '@coinbase/onchainkit/identity'
import { useAccount, useChainId } from 'wagmi'
import { useEffect, useState } from 'react'

export function NetworkStatus() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [networkStatus, setNetworkStatus] = useState({
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    message: "Checking network..."
  })

  useEffect(() => {
    if (!isConnected) {
      setNetworkStatus({
        color: "bg-red-500",
        textColor: "text-red-600",
        message: "Not connected to Base Sepolia"
      })
      return
    }

    // Base Sepolia chainId is 84532
    const isBaseSepolia = chainId === 84532
    
    setNetworkStatus({
      color: isBaseSepolia ? "bg-green-500" : "bg-yellow-500",
      textColor: isBaseSepolia ? "text-green-600" : "text-yellow-600",
      message: isBaseSepolia 
        ? "Connected to Base Sepolia" 
        : `Connected to chain ID: ${chainId || "unknown"}`
    })
  }, [isConnected, chainId])

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Network Status Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className={`inline-block h-2 w-2 rounded-full ${networkStatus.color}`}></span>
        <span className={`${networkStatus.textColor} font-medium`}>{networkStatus.message}</span>
      </div>
      
      {/* OnchainKit Wallet Component */}
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownLink
            icon="wallet"
            href="https://keys.coinbase.com"
          >
            Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  )
}