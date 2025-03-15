"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { topTippers } from "@/lib/transactions"
import { truncateAddress, generateAvatarUrl } from "@/lib/utils"

export function TopTippers() {
  const [timeframe, setTimeframe] = useState("daily")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Tippers</CardTitle>
        <CardDescription>The most generous users on BaseTip</CardDescription>
        <Tabs defaultValue="daily" value={timeframe} onValueChange={setTimeframe} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTippers.map((tipper, index) => (
            <div key={tipper.address} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
                {index + 1}
              </div>
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={generateAvatarUrl(tipper.address)} />
                <AvatarFallback>{tipper.address.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{truncateAddress(tipper.address)}</p>
                <p className="text-sm text-gray-500">{tipper.transactions} transactions</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                {tipper.totalTipped} ETH
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">Top tippers receive daily NFT rewards!</div>
      </CardContent>
    </Card>
  )
}

