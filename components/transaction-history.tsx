"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { getTransactionHistory, type Transaction, likeTransaction } from "@/lib/transactions"
import { formatDate, truncateAddress, generateAvatarUrl } from "@/lib/utils"

interface TransactionHistoryProps {
  address: string
}

export function TransactionHistory({ address }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const history = await getTransactionHistory(address)
        setTransactions(history)
      } catch (error) {
        console.error("Failed to fetch transaction history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      fetchTransactions()
    }
  }, [address])

  const handleLike = async (txHash: string) => {
    try {
      await likeTransaction(txHash)
      setTransactions((prev) =>
        prev.map((tx) => (tx.hash === txHash ? { ...tx, likes: (tx.likes || 0) + 1, hasLiked: true } : tx)),
      )
    } catch (error) {
      console.error("Failed to like transaction:", error)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true
    if (activeTab === "sent") return tx.type === "sent"
    if (activeTab === "received") return tx.type === "received"
    return true
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-medium">No transactions found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Once you send or receive tips, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredTransactions.map((tx) => (
        <Card key={tx.hash} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={generateAvatarUrl(tx.type === "sent" ? tx.to : tx.from)} />
                <AvatarFallback>
                  {tx.type === "sent" ? tx.to.slice(2, 4).toUpperCase() : tx.from.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {tx.type === "sent"
                        ? `Sent to ${truncateAddress(tx.to)}`
                        : `Received from ${truncateAddress(tx.from)}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.timestamp)}</p>
                  </div>
                  <Badge variant={tx.type === "sent" ? "destructive" : "default"} className="ml-auto">
                    {tx.type === "sent" ? "-" : "+"}
                    {tx.amount} ETH
                  </Badge>
                </div>

                {tx.message && <div className="rounded-lg bg-muted p-3 text-sm">"{tx.message}"</div>}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                      onClick={() => handleLike(tx.hash)}
                      disabled={tx.hasLiked}
                    >
                      <Heart className="h-4 w-4" fill={tx.hasLiked ? "currentColor" : "none"} />
                      <span>{tx.likes || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{tx.comments || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <a
                    href={`https://base.blockscout.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View on Base Explorer
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

