"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { truncateAddress } from "@/lib/utils"
import { Crown, Medal, Star, Award } from "lucide-react"

// Updated NFT rewards with simple colored circles and icons
const nftRewards = [
  {
    id: 1,
    name: "Top Tipper #1",
    color: "bg-blue-500",
    icon: <Crown className="h-10 w-10 text-white" />,
    owner: "0x1234...7890",
    date: "2023-04-15",
  },
  {
    id: 2,
    name: "Daily Champion",
    color: "bg-yellow-400",
    icon: <Star className="h-10 w-10 text-white" />,
    owner: "0x2345...8901",
    date: "2023-04-14",
  },
  {
    id: 3,
    name: "Community Builder",
    color: "bg-gray-300",
    icon: <Medal className="h-10 w-10 text-white" />,
    owner: "0x3456...9012",
    date: "2023-04-13",
  },
  {
    id: 4,
    name: "Generous Supporter",
    color: "bg-amber-700",
    icon: <Medal className="h-10 w-10 text-white" />,
    owner: "0x4567...0123",
    date: "2023-04-12",
  },
]

export function NFTShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Daily NFT Rewards
        </CardTitle>
        <CardDescription>Top tippers receive exclusive NFTs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nftRewards.map((nft) => (
            <Card key={nft.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted flex items-center justify-center p-4">
                <div
                  className={`w-32 h-32 rounded-full ${nft.color} flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800`}
                >
                  {nft.icon}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{nft.name}</h3>
                <p className="text-sm text-gray-500">Awarded to {truncateAddress(nft.owner)}</p>
                <p className="text-xs text-gray-400 mt-1">Awarded on {nft.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

