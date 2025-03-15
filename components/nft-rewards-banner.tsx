import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Star, Award } from "lucide-react"

// NFT reward tiers with simple colored circles and icons
const NFT_REWARDS = [
  {
    name: "Bronze Supporter",
    requirement: "Tip 0.1 ETH",
    color: "bg-amber-700", // Bronze color
    icon: <Medal className="h-8 w-8 text-white" />,
    description: "Basic supporter badge",
  },
  {
    name: "Silver Supporter",
    requirement: "Tip 0.5 ETH",
    color: "bg-gray-300", // Silver color
    icon: <Medal className="h-8 w-8 text-white" />,
    description: "Exclusive chat emotes",
  },
  {
    name: "Gold Supporter",
    requirement: "Tip 1 ETH",
    color: "bg-yellow-400", // Gold color
    icon: <Star className="h-8 w-8 text-white" />,
    description: "Special profile badge",
  },
  {
    name: "Top Tipper (24h)",
    requirement: "Highest daily tipper",
    color: "bg-blue-500", // Blue color for top tipper
    icon: <Crown className="h-8 w-8 text-white" />,
    description: "Featured on streamer's page",
  },
]

export function NFTRewardsBanner() {
  return (
    <div className="w-full overflow-hidden bg-muted rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Award className="h-5 w-5" />
          NFT Rewards for Tippers
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Earn exclusive NFTs by supporting your favorite streamers</p>
      </div>
      <div className="flex overflow-x-auto pb-4 px-4 gap-4">
        {NFT_REWARDS.map((reward) => (
          <Card key={reward.name} className="min-w-[200px] flex-shrink-0">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-full ${reward.color} mb-3 flex items-center justify-center shadow-md border-4 border-white dark:border-gray-800`}
              >
                {reward.icon}
              </div>
              <h4 className="font-bold">{reward.name}</h4>
              <Badge variant="outline" className="my-1">
                {reward.requirement}
              </Badge>
              <p className="text-xs text-muted-foreground">{reward.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

