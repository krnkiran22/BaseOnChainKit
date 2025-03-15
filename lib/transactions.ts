import { parseEther } from "viem"
import { publicClient } from "@/lib/wallet"

// Recipient address for all tips
const RECIPIENT_ADDRESS = "0xD161509B5D4905064097a8Af0a8c2aC78320DeF6"

export interface TipParams {
  from: string
  to: string
  amount: string
  message: string
}

export interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  message?: string
  timestamp: number
  type: "sent" | "received"
  likes?: number
  comments?: number
  hasLiked?: boolean
  status?: "pending" | "confirmed" | "failed"
}

// Mock data for top tippers
export const topTippers = [
  { address: "0x1234567890123456789012345678901234567890", totalTipped: "5.23", transactions: 12 },
  { address: "0x2345678901234567890123456789012345678901", totalTipped: "3.45", transactions: 8 },
  { address: "0x3456789012345678901234567890123456789012", totalTipped: "2.78", transactions: 6 },
  { address: "0x4567890123456789012345678901234567890123", totalTipped: "1.92", transactions: 5 },
  { address: "0x5678901234567890123456789012345678901234", totalTipped: "1.45", transactions: 4 },
]

// Updated mock data for NFT rewards with simple colored circles and icons
export const nftRewards = [
  {
    id: 1,
    name: "Top Tipper #1",
    color: "bg-blue-500",
    owner: "0x1234...7890",
    date: "2023-04-15",
  },
  {
    id: 2,
    name: "Daily Champion",
    color: "bg-yellow-400",
    owner: "0x2345...8901",
    date: "2023-04-14",
  },
  {
    id: 3,
    name: "Community Builder",
    color: "bg-gray-300",
    owner: "0x3456...9012",
    date: "2023-04-13",
  },
  {
    id: 4,
    name: "Generous Supporter",
    color: "bg-amber-700",
    owner: "0x4567...0123",
    date: "2023-04-12",
  },
]

// Send a tip - this will execute a real transaction
export async function sendTip({ from, to, amount, message }: TipParams): Promise<string> {
  try {
    // Always send to the specified recipient address regardless of the 'to' parameter
    const actualRecipient = RECIPIENT_ADDRESS

    // Request transaction from wallet
    const hash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from,
          to: actualRecipient, // Use the specified recipient address
          value: parseEther(amount).toString(16), // Convert to hex
          data: message ? `0x${Buffer.from(message, "utf8").toString("hex")}` : "0x",
        },
      ],
    })

    // Store transaction in local storage for history
    const transaction: Transaction = {
      hash,
      from,
      to: to, // Keep the original 'to' for display purposes
      amount,
      message,
      timestamp: Date.now(),
      type: "sent",
      likes: 0,
      comments: 0,
      hasLiked: false,
      status: "pending",
    }

    // Get existing transactions from local storage
    const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${from}`) || "[]")

    // Add new transaction and save back to local storage
    localStorage.setItem(`transactions_${from}`, JSON.stringify([transaction, ...existingTransactions]))

    // Start monitoring the transaction
    monitorTransaction(hash, from)

    return hash
  } catch (error) {
    console.error("Error sending tip:", error)
    throw new Error("Failed to send tip")
  }
}

// Monitor transaction status
async function monitorTransaction(txHash: string, address: string) {
  try {
    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` })

    // Update transaction status in local storage
    const transactions = JSON.parse(localStorage.getItem(`transactions_${address}`) || "[]")
    const updatedTransactions = transactions.map((tx: Transaction) =>
      tx.hash === txHash ? { ...tx, status: receipt.status === "success" ? "confirmed" : "failed" } : tx,
    )

    localStorage.setItem(`transactions_${address}`, JSON.stringify(updatedTransactions))

    return receipt
  } catch (error) {
    console.error("Error monitoring transaction:", error)

    // Update transaction as failed
    const transactions = JSON.parse(localStorage.getItem(`transactions_${address}`) || "[]")
    const updatedTransactions = transactions.map((tx: Transaction) =>
      tx.hash === txHash ? { ...tx, status: "failed" } : tx,
    )

    localStorage.setItem(`transactions_${address}`, JSON.stringify(updatedTransactions))
  }
}

// Get transaction history for an address
export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  try {
    // For demo purposes, we'll use local storage
    // In a real app, you would query the blockchain or an indexer
    const transactions = JSON.parse(localStorage.getItem(`transactions_${address}`) || "[]")

    // Add some mock received transactions if none exist
    if (transactions.length === 0 || !transactions.some((tx) => tx.type === "received")) {
      const mockReceived = [
        {
          hash: "0x" + Math.random().toString(16).substring(2, 42),
          from: "0x1234567890123456789012345678901234567890",
          to: address,
          amount: "0.05",
          message: "Thanks for your help with the project!",
          timestamp: Date.now() - 86400000, // 1 day ago
          type: "received",
          likes: 3,
          comments: 1,
          hasLiked: false,
          status: "confirmed",
        },
        {
          hash: "0x" + Math.random().toString(16).substring(2, 42),
          from: "0x2345678901234567890123456789012345678901",
          to: address,
          amount: "0.02",
          message: "Great work on the Base hackathon!",
          timestamp: Date.now() - 172800000, // 2 days ago
          type: "received",
          likes: 1,
          comments: 0,
          hasLiked: false,
          status: "confirmed",
        },
      ]

      return [...transactions, ...mockReceived]
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return transactions
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}

// Like a transaction
export async function likeTransaction(txHash: string): Promise<void> {
  // In a real app, this would call an API
  // For demo purposes, we'll just return a resolved promise
  return Promise.resolve()
}

