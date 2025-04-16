"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit3, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TwitchStreamTip } from "@/components/twitch-stream-tip"
import { useAccount } from "@/hooks/use-account"

const RECIPIENT_ADDRESS = "0xE8C42b0c182d31F06d938a97a969606A7731fFda"

export function TwitchStream() {
  const [tipAmount, setTipAmount] = useState("0.01")
  const [customAmount, setCustomAmount] = useState("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [message, setMessage] = useState("")
  const [showTipOverlay, setShowTipOverlay] = useState(false)
  const [tipOverlayData, setTipOverlayData] = useState(null)
  const [lastTxHash, setLastTxHash] = useState(null)
  const { toast } = useToast()
  const { address } = useAccount()

  // Hide tip overlay after 5 seconds with proper cleanup
  useEffect(() => {
    let timer = null
    if (showTipOverlay) {
      timer = setTimeout(() => {
        setShowTipOverlay(false)
      }, 5000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showTipOverlay])

  // Reset custom amount when selecting a preset
  useEffect(() => {
    if (!isCustomAmount) {
      setCustomAmount("")
    }
  }, [isCustomAmount])

  const handleSelectPresetAmount = useCallback((amount) => {
    setTipAmount(amount)
    setIsCustomAmount(false)
  }, [])

  const handleCustomAmountChange = useCallback((e) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value)
      if (value && Number(value) > 0) {
        setIsCustomAmount(true)
      }
    }
  }, [])

  const handleTipSuccess = useCallback((txHash) => {
    setLastTxHash(txHash)

    setTipOverlayData({
      from: address,
      amount: isCustomAmount && customAmount ? customAmount : tipAmount,
      message: message || "Thanks for the stream!",
      timestamp: new Date().toISOString(),
      txHash,
    })
    setShowTipOverlay(true)

    toast({
      title: "Tip sent!",
      description: (
        <div className="flex flex-col gap-1">
          <span>
            You tipped {isCustomAmount && customAmount ? customAmount : tipAmount} ETH
          </span>
          <a
            href={`https://sepolia-explorer.base.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs flex items-center gap-1 text-blue-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View transaction
          </a>
        </div>
      ),
    })

    setMessage("")
    if (isCustomAmount) {
      setCustomAmount("")
      setIsCustomAmount(false)
      setTipAmount("0.01")
    }
  }, [address, customAmount, isCustomAmount, message, tipAmount, toast])

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        {/* Tip Overlay */}
        {showTipOverlay && tipOverlayData && (
          <div className="relative w-full bg-black rounded-md overflow-hidden mb-4">
            <div className="w-full bg-black/80 text-white p-4 rounded-lg border border-blue-500 animate-slide-down">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {address?.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-lg flex items-center gap-2">
                    <span>
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <span className="text-blue-400">tipped {tipOverlayData.amount} ETH</span>
                  </div>
                  <div className="text-sm opacity-80">{tipOverlayData.message}</div>
                  {tipOverlayData.txHash && (
                    <a
                      href={`https://sepolia-explorer.base.org/tx/${tipOverlayData.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs flex items-center gap-1 text-blue-500 hover:underline pointer-events-auto"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View transaction
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mb-2">
          All tips go to: {RECIPIENT_ADDRESS.slice(0, 6)}...{RECIPIENT_ADDRESS.slice(-4)}
        </div>

        {/* Amount selection section */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {["0.01", "0.05", "0.1", "0.5", "1"].map((amount) => (
              <Button
                key={amount}
                variant={!isCustomAmount && tipAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectPresetAmount(amount)}
              >
                {amount} ETH
              </Button>
            ))}
            <Button
              variant={isCustomAmount ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCustomAmount(true)}
              className="flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              Custom
            </Button>
          </div>

          {isCustomAmount && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="max-w-[150px]"
                autoFocus
              />
              <span className="text-sm font-medium">ETH</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="w-full">
            <Input
              placeholder="Add a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-right mt-1 text-muted-foreground">
              {message.length}/200 characters
            </div>
          </div>
          
          <div className="flex justify-end">
            <TwitchStreamTip
              isCustomAmount={isCustomAmount}
              customAmount={customAmount}
              tipAmount={tipAmount}
              message={message}
              onTipSuccess={handleTipSuccess}
            />
          </div>
        </div>

        {lastTxHash && (
          <div className="mt-2 text-xs">
            <a
              href={`https://sepolia-explorer.base.org/tx/${lastTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View last transaction
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">Tips are sent directly to the recipient's wallet</CardFooter>
    </Card>
  )
}