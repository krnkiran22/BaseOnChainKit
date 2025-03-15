import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
import { createPublicClient, http, parseEther } from "viem"
import { baseGoerli } from "viem/chains"

// Base Sepolia Configuration
const BASE_SEPOLIA_CHAIN_ID = "0x14a34" // 84532 in decimal
const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org"
const BASE_SEPOLIA_BLOCK_EXPLORER = "https://sepolia-explorer.base.org/"

// Initialize the Coinbase Wallet SDK
export const coinbaseWalletSDK = new CoinbaseWalletSDK({
  appName: "BaseTip",
  appLogoUrl: "/placeholder.svg?height=100&width=100&text=BT",
  darkMode: false,
})

// Create a Web3 provider
export const ethProvider = coinbaseWalletSDK.makeWeb3Provider(
  BASE_SEPOLIA_RPC_URL,
  84532, // Chain ID
)

// Create a public client for Base Sepolia
export const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http(BASE_SEPOLIA_RPC_URL),
})

// Connect smart wallet
export async function connectSmartWallet(): Promise<string> {
  try {
    // This will prompt the user to create or connect a Coinbase Smart Wallet
    const accounts = await ethProvider.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const address = accounts[0]

    // Check if we're on the correct network
    const chainId = await ethProvider.request({
      method: "eth_chainId",
    })

    // Switch to Base Sepolia if needed
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      try {
        await ethProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        })
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to the wallet
        if (switchError.code === 4902) {
          await ethProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: "Base Sepolia",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [BASE_SEPOLIA_RPC_URL],
                blockExplorerUrls: [BASE_SEPOLIA_BLOCK_EXPLORER],
              },
            ],
          })
        } else {
          throw switchError
        }
      }
    }

    return address
  } catch (error) {
    console.error("Error connecting smart wallet:", error)
    throw new Error("Failed to connect smart wallet")
  }
}

// Check if connected to Base Sepolia with smart wallet
export async function isSmartWalletConnectedToBaseSepolia(): Promise<boolean> {
  try {
    const chainId = await ethProvider.request({
      method: "eth_chainId",
    })

    return chainId === BASE_SEPOLIA_CHAIN_ID
  } catch (error) {
    console.error("Error checking network with smart wallet:", error)
    return false
  }
}

// Send transaction with smart wallet
export async function sendSmartWalletTransaction(params: {
  from: string
  to: string
  value: string
  data?: string
}): Promise<string> {
  try {
    const txParams = {
      from: params.from,
      to: params.to,
      value: parseEther(params.value).toString(16),
      data: params.data || "0x",
    }

    const txHash = await ethProvider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    })

    return txHash as string
  } catch (error) {
    console.error("Error sending transaction with smart wallet:", error)
    throw new Error("Failed to send transaction with smart wallet")
  }
}

// Disconnect smart wallet
export async function disconnectSmartWallet(): Promise<void> {
  try {
    // Disconnect the wallet
    coinbaseWalletSDK.disconnect()
    return Promise.resolve()
  } catch (error) {
    console.error("Error disconnecting smart wallet:", error)
    return Promise.resolve()
  }
}

