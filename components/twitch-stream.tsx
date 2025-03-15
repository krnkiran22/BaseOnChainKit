"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share2, ExternalLink, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TwitchStreamTip } from "@/components/twitch-stream-tip"
import { useAccount } from "@/hooks/use-account"

// Recipient address for all tips
const RECIPIENT_ADDRESS = "0xD161509B5D4905064097a8Af0a8c2aC78320DeF6"

// Sample streamer data with images
const SAMPLE_STREAMERS = {
  ninja: {
    displayName: "Ninja",
    image:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/6d942669-203f-464d-8623-db376ff971e0-profile_image-300x300.png",
    game: "Fortnite",
  },
  pokimane: {
    displayName: "Pokimane",
    image: "https://static-cdn.jtvnw.net/jtv_user_pictures/pokimane-profile_image-5fdd3d1e00c3c9f5-300x300.png",
    game: "Just Chatting",
  },
  shroud: {
    displayName: "shroud",
    image:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png",
    game: "Valorant",
  },
  timthetatman: {
    displayName: "TimTheTatman",
    image:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/bd6ad022-5295-4ce6-9d21-37b32200c0d2-profile_image-300x300.png",
    game: "Call of Duty",
  },
  xqc: {
    displayName: "xQc",
    image: "https://static-cdn.jtvnw.net/jtv_user_pictures/xqc-profile_image-9298dca608632101-300x300.jpeg",
    game: "Just Chatting",
  },
}

export function TwitchStream() {
  const [streamUsername, setStreamUsername] = useState("")
  const [currentStream, setCurrentStream] = useState("")
  const [streamerInfo, setStreamerInfo] = useState(null)
  const [tipAmount, setTipAmount] = useState("0.01")
  const [customAmount, setCustomAmount] = useState("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [showTipOverlay, setShowTipOverlay] = useState(false)
  const [tipOverlayData, setTipOverlayData] = useState(null)
  const [lastTxHash, setLastTxHash] = useState(null)
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const streamContainerRef = useRef(null)
  
  // Use ref for values that don't need to trigger re-renders
  const viewerCountRef = useRef(Math.floor(Math.random() * 50000) + 1000)
  const likesCountRef = useRef(Math.floor(Math.random() * 10000) + 100)
  const commentsCountRef = useRef(Math.floor(Math.random() * 1000) + 10)

  // Generate random viewer count when stream changes - use ref to prevent re-renders
  useEffect(() => {
    if (currentStream) {
      viewerCountRef.current = Math.floor(Math.random() * 50000) + 1000
      // Only update state once
      setViewerCount(viewerCountRef.current)
    }
  }, [currentStream])

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

  // Memoized submit handler
  const handleSubmit = useCallback((e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    
    if (!streamUsername) return

    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setCurrentStream(streamUsername.toLowerCase())

      // Get streamer info if available, or create generic info
      const info = SAMPLE_STREAMERS[streamUsername.toLowerCase()] || {
        displayName: streamUsername,
        image: `/placeholder.svg?height=300&width=300&text=${streamUsername.slice(0, 2).toUpperCase()}`,
        game: "Live Stream",
      }

      setStreamerInfo(info)
      setIsLoading(false)
    }, 1000)
  }, [streamUsername])

  // Memoized quick stream handler
  const handleQuickStream = useCallback((username) => {
    setStreamUsername(username)
    handleSubmit(new Event("submit"))
  }, [handleSubmit])

  // Memoized preset amount handler
  const handleSelectPresetAmount = useCallback((amount) => {
    setTipAmount(amount)
    setIsCustomAmount(false)
  }, [])

  // Memoized custom amount handler
  const handleCustomAmountChange = useCallback((e) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value)
      if (value && Number(value) > 0) {
        setIsCustomAmount(true)
      }
    }
  }, [])

  // Memoized tip success handler with all dependencies
  const handleTipSuccess = useCallback((txHash) => {
    setLastTxHash(txHash)

    // Show tip overlay
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
            You tipped {isCustomAmount && customAmount ? customAmount : tipAmount} ETH to{" "}
            {streamerInfo?.displayName || currentStream}
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

    // Reset fields in a controlled way
    setMessage("")
    if (isCustomAmount) {
      setCustomAmount("")
      setIsCustomAmount(false)
      setTipAmount("0.01") // Reset to default amount
    }
  }, [address, customAmount, isCustomAmount, message, streamerInfo, currentStream, tipAmount, toast])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tip Twitch Streamers</CardTitle>
        <CardDescription>Watch your favorite Twitch streamers and tip them with ETH</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Enter Twitch username"
            value={streamUsername}
            onChange={(e) => setStreamUsername(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !streamUsername}>
            {isLoading ? "Loading..." : "Watch"}
          </Button>
        </form>

        {!currentStream ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
            {Object.entries(SAMPLE_STREAMERS).map(([username, info]) => (
              <div
                key={username}
                className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleQuickStream(username)}
              >
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={info.image} alt={info.displayName} />
                  <AvatarFallback>{info.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{info.displayName}</div>
                <div className="text-xs text-muted-foreground">{info.game}</div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="relative pb-[56.25%] h-0 bg-black rounded-md overflow-hidden" ref={streamContainerRef}>
              <iframe
                src={`https://player.twitch.tv/?channel=${currentStream}&parent=${window.location.hostname}&autoplay=true&muted=false`}
                title={`${currentStream}'s Twitch Stream`}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
              ></iframe>

              {/* Tip Overlay */}
              {showTipOverlay && tipOverlayData && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-4 left-0 right-0 mx-auto w-max max-w-[90%] bg-black/80 text-white p-4 rounded-lg border border-blue-500 animate-slide-down">
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
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={streamerInfo?.image} alt={streamerInfo?.displayName || currentStream} />
                <AvatarFallback>
                  {(streamerInfo?.displayName || currentStream).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{streamerInfo?.displayName || currentStream}</h3>
                  <Badge variant="outline" className="text-red-500">
                    Live
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {viewerCount.toLocaleString()} viewers • {streamerInfo?.game || "Streaming"}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{likesCountRef.current}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{commentsCountRef.current}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Send a tip to {streamerInfo?.displayName || currentStream}</h4>
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
              {/* Message input in its own div */}
              <div className="w-full">
                <Input
                  placeholder="Add a message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full"
                />
                {/* Optional character counter */}
                <div className="text-xs text-right mt-1 text-muted-foreground">
                  {message.length}/200 characters
                </div>
              </div>
              
              {/* Tip button in its own row */}
              <div className="flex justify-end">
                <TwitchStreamTip
                  streamerName={streamerInfo?.displayName || currentStream}
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
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">Tips are sent directly to the streamer's wallet</CardFooter>
    </Card>
  )
}