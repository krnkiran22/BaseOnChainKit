# BaseTip



## 🚀 Social tipping platform for Twitch streamers on Base Sepolia

### Overview

BaseTip enables viewers to send ETH tips to their favorite Twitch streamers with just a few clicks, creating a more direct relationship between creators and their audience. The platform gamifies tipping with NFT rewards, encouraging community support.

## 🎯 The Problem It Solves

Traditional donation methods often involve high fees and complex setup processes. BaseTip solves this by:

- Allowing users to send ETH tips seamlessly
- Providing a transparent and direct connection between viewers and streamers
- Gamifying tipping with NFT rewards
- Embedding Twitch streams directly in the platform

## 🔄 User Interaction and Data Flow

1. Users connect their wallet using MetaMask or Coinbase Wallet.
2. They browse popular streamers or search for a Twitch username.
3. The selected stream is embedded within the app.
4. Users select a tip amount, add a message, and send the transaction.
5. The transaction is executed on the Base Sepolia network and appears as an overlay on the stream.
6. Users can track their transactions and see their position on the leaderboard.
7. Top tippers receive NFT rewards to showcase their support.

### Data Flow

- Wallet connection via Web3 providers
- Twitch API integration for stream embedding
- On-chain transactions for tips
- Local storage for transaction history
- UI overlays for real-time visual feedback

## 🏗️ Project Architecture & Development Process

### **Tech Stack:**

- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
- **Blockchain Integration:** Web3, Viem, MetaMask/Coinbase Wallet
- **State Management:** React hooks and context
- **Data Persistence:** Local storage for transaction history

### **Development Steps:**

1. Setup Next.js with Tailwind CSS
2. Implement wallet connection functionality
3. Create Twitch stream viewer component
4. Build tipping mechanism with transaction execution
5. Add social features like leaderboard & transaction history
6. Implement NFT reward visualization
7. Add network status indicators and transaction monitoring

## 🔗 Product Integrations

- **Base Sepolia Testnet**: Executes transactions securely
- **Twitch API**: Embeds live streams in the application
- **MetaMask & Coinbase Wallet**: Wallet connection and transaction signing
- **Base Explorer**: Transaction verification & tracking

## 🔥 Key Differentiators

✅ **Seamless Twitch & Crypto Integration** – Watch streams and tip ETH in one place\
✅ **Real-Time Tip Overlays** – Tips appear on the stream for instant recognition\
✅ **Gamified Tipping with NFT Rewards** – Support streamers and earn collectible badges\
✅ **Cross-Platform & Wallet-Friendly** – Works across devices with MetaMask & Coinbase Wallet\
✅ **Low Barrier to Entry** – Easy-to-use UI for non-technical users\
✅ **Leaderboards & Social Elements** – Encourages community engagement

## ⚖️ Trade-Offs & Shortcuts

- **Testnet Deployment** – Using Base Sepolia instead of Mainnet for now
- **Local Storage Only** – No database for persistent storage yet
- **Mock Data for Leaderboards** – No real-time blockchain data yet
- **Limited Wallet Support** – Currently supporting only MetaMask & Coinbase Wallet
- **Single Recipient** – Tips currently go to a single test address

### **Future Improvements:**

- Mainnet deployment with real ETH transactions
- Backend integration for enhanced data persistence
- Streamer onboarding for custom wallets
- Advanced analytics for streamers
- Mobile app development

## 🔥 Additional Features Built

✅ Real ETH transaction execution\
✅ Network status indicators\
✅ Transaction monitoring & status updates\
✅ Custom amount input for flexible tipping\
✅ Real-time visual tip overlays on streams\
✅ NFT reward badges with different tiers\
✅ Twitch stream embedding with interactive elements

## 🛠️ Setup & Installation

### **Prerequisites:**

Ensure you have Node.js 22.0.0 installed. If not, use [nvm](https://github.com/nvm-sh/nvm) to manage versions.

```bash
nvm use 22.0.0
```

### **Installation & Running the App:**

```bash
npm install --legacy-peer-deps
npm run dev
```

The app should now be running locally at `http://localhost:3000/`.

![alt text](https://github.com/ammadhh/BaseTip/blob/main/mainbase.png)

---

### 👨‍💻 Created by Ammad Hassan

[LinkedIn](https://www.linkedin.com/in/ammadhassan1/)
[Link to BaseTip](https://basetip.vercel.app/)
https://basetip.vercel.app/



### Made with ❤️ for Twitch streamers and the crypto community!

