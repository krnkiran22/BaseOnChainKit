import { createPublicClient, http } from "viem"
import { baseGoerli } from "viem/chains"

// Base Sepolia Configuration
const BASE_SEPOLIA_CHAIN_ID = "0x14a34" // 84532 in decimal
const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org"
const BASE_SEPOLIA_BLOCK_EXPLORER = "https://sepolia-explorer.base.org/"

// Create a public client for Base Testnet
export const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http(BASE_SEPOLIA_RPC_URL),
})

// Connect wallet function using window.ethereum directly
export async function connectWallet(): Promise<string> {
  try {
    // Check if MetaMask or Coinbase Wallet is installed
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet found. Please install Coinbase Wallet or MetaMask.")
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const address = accounts[0]

    // Check if we're on the correct network (Base Testnet)
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })

    // Base Testnet chainId is 0x14a33 (84531 in decimal)
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      // Prompt user to switch to Base Testnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        })
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to the wallet
        if (switchError.code === 4902) {
          await window.ethereum.request({
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
    console.error("Error connecting wallet:", error)
    throw new Error("Failed to connect wallet")
  }
}

// Check if connected to Base Testnet
export async function isConnectedToBaseSepolia(): Promise<boolean> {
  try {
    if (!window.ethereum) return false

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })

    return chainId === BASE_SEPOLIA_CHAIN_ID
  } catch (error) {
    console.error("Error checking network:", error)
    return false
  }
}

// Disconnect wallet function
export async function disconnectWallet(): Promise<void> {
  // For most wallets, there's no direct disconnect method
  // We just clear our local state
  return Promise.resolve()
}

