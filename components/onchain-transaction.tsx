"use client"

import { useCallback } from "react"
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction"
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction"
import { parseEther } from "viem"
import { Send } from "lucide-react"

// Base Sepolia Configuration
const BASE_SEPOLIA_CHAIN_ID = 84532

// Recipient address for all tips
const RECIPIENT_ADDRESS = "0xD161509B5D4905064097a8Af0a8c2aC78320DeF6"

interface OnchainTransactionProps {
  amount: string
  message?: string
  onSuccess?: (txHash: string) => void
  disabled?: boolean
  isSubmitting?: boolean
}

export function OnchainTransaction({ amount, message, onSuccess, disabled, isSubmitting }: OnchainTransactionProps) {
  const calls = [
    {
      to: RECIPIENT_ADDRESS,
      value: parseEther(amount),
      data: message ? `0x${Buffer.from(message, "utf8").toString("hex")}` : "0x",
    },
  ]

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      console.log("Transaction status:", status)

      if (status.statusName === "success" && onSuccess && status.statusData.transactionReceipts?.length > 0) {
        // Extract the transaction hash from the first receipt
        const txHash = status.statusData.transactionReceipts[0].transactionHash
        onSuccess(txHash)
      }
    },
    [onSuccess],
  )

  return (
    <Transaction chainId={BASE_SEPOLIA_CHAIN_ID} calls={calls} onStatus={handleOnStatus}>
      <div className="flex flex-col gap-2">
        <TransactionButton
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md flex items-center justify-center gap-2"
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send Tip"}
        </TransactionButton>
        <TransactionStatus>
          <div className="mt-2 text-sm">
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </div>
        </TransactionStatus>
      </div>
    </Transaction>
  )
}

