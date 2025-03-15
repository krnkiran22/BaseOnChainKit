// TippingDashboard.tsx - FIXED
"use client"

import { useState } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { TippingForm } from "@/components/tipping-form"
import { TransactionHistory } from "@/components/transaction-history"
import { TopTippers } from "@/components/top-tippers"
import { NFTShowcase } from "@/components/nft-showcase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "@/hooks/use-account"

export function TippingDashboard() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("send")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>BaseTip Dashboard</CardTitle>
            <CardDescription>Connect your wallet to send tips and view your transaction history</CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <p className="text-center text-lg font-medium">Connect your wallet to get started</p>
                <WalletConnect />
              </div>
            ) : (
              <Tabs defaultValue="send" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="send">Send Tip</TabsTrigger>
                  <TabsTrigger value="history">Transaction History</TabsTrigger>
                </TabsList>
                <TabsContent value="send">
                  <TippingForm />
                </TabsContent>
                <TabsContent value="history">
                  <TransactionHistory address={address} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <TopTippers />
        <NFTShowcase />
      </div>
    </div>
  )
}