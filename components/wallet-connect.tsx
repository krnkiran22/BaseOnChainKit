"use client"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useAccount } from "@/hooks/use-account"
import { ConnectWallet, Wallet as OnchainWallet } from "@coinbase/onchainkit/wallet"

export function WalletConnect() {
  const { setAddress } = useAccount()

  return (
    <div className="flex items-center justify-center w-full">
      <OnchainWallet>
        <ConnectWallet
          onConnect={(details) => {
            console.log("Connected wallet:", details)
            if (details.address) {
              setAddress(details.address)
            }
          }}
          onDisconnect={() => {
            console.log("Disconnected wallet")
            setAddress("")
          }}
          className="w-full"
        >
          {({ address }) => (
            <Button 
              variant={address ? "outline" : "default"} 
              className="flex items-center gap-2 w-full max-w-full overflow-visible px-3"
            >
              <Wallet className="h-4 w-4 flex-shrink-0" />
              {address ? (
                <span className="text-sm font-mono truncate text-left">
                  {address}
                </span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </Button>
          )}
        </ConnectWallet>
      </OnchainWallet>
    </div>
  )
}