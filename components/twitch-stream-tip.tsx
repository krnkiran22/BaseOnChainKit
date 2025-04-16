"use client"

import { useState, useCallback } from "react"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TransactionDefault } from "@coinbase/onchainkit/transaction"
import { parseEther } from "viem"

// Base Sepolia Configuration
const BASE_SEPOLIA_CHAIN_ID = 84532

// Recipient address for all tips
const RECIPIENT_ADDRESS = "0xE8C42b0c182d31F06d938a97a969606A7731fFda"

interface TwitchStreamTipProps {
  streamerName: string
  isCustomAmount: boolean
  customAmount: string
  tipAmount: string
  message: string
  onTipSuccess: (txHash: string) => void
}

export function TwitchStreamTip({
  streamerName,
  isCustomAmount,
  customAmount,
  tipAmount,
  message,
  onTipSuccess,
}: TwitchStreamTipProps) {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()
  
  // Get the actual amount to send
  const actualAmount = isCustomAmount && customAmount ? customAmount : tipAmount
  
  // Handle transaction status change - use useCallback to prevent recreating on each render
  const handleStatus = useCallback((status: any) => {
    console.log("Transaction status:", status.statusName)
    
    if (status.statusName === "preparing") {
      setIsSending(true)
    } else if (
      status.statusName === "rejected" || 
      status.statusName === "failed"
    ) {
      setIsSending(false)
      toast({
        title: "Transaction failed",
        description: "Your tip could not be processed. Please try again.",
        variant: "destructive",
      })
    } else if (
      status.statusName === "success" && 
      status.statusData.transactionReceipts?.length > 0
    ) {
      setIsSending(false)
      const txHash = status.statusData.transactionReceipts[0].transactionHash
      // Use setTimeout to break the synchronous call chain
      setTimeout(() => {
        onTipSuccess(txHash)
      }, 0)
    }
  }, [toast, onTipSuccess])

  // Create transaction call
  const calls = [
    {
      to: RECIPIENT_ADDRESS,
      value: parseEther(actualAmount),
      data: message ? `0x${Buffer.from(message || `Tip to ${streamerName}`, "utf8").toString("hex")}` : "0x",
    },
  ]
  
  return (
    <TransactionDefault
      chainId={BASE_SEPOLIA_CHAIN_ID}
      calls={calls}
      onStatus={handleStatus}
      buttonClassName="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md flex items-center justify-center gap-2"
      buttonDisabled={isSending}
      buttonText={isSending ? "Sending..." : "Send Tip"}
      buttonIcon={<Send className="h-4 w-4" />}
    />
  )
}