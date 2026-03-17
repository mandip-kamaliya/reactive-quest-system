# Reactive Quest System

A gamified blockchain achievement system with real-time updates powered by Somnia Reactivity SDK.

## 🎯 Overview

The Reactive Quest System demonstrates the power of Somnia's native on-chain reactivity by creating a gamified layer where users can complete quests, earn achievements, and level up based on their blockchain activities - all updated instantly without polling.

## ✨ Key Features

- **Real-time Quest Updates**: Instant progress tracking using Somnia Reactivity
- **Achievement System**: Unlock badges and earn SOMI tokens
- **Live Progress Bars**: Visual feedback that updates in real-time
- **Event-driven Architecture**: Reacts to on-chain events automatically
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Blockchain**: Somnia Network, Ethers.js
- **Real-time**: Somnia Reactivity SDK
- **UI Components**: Radix UI, Custom Components

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/mandip-kamaliya/reactive-quest-system.git
cd reactive-quest-system
```

2. Install dependencies:
```bash
npm install
# or with legacy peer deps for Somnia SDK
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Add your Somnia project configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── QuestCard.tsx   # Quest display component
│   │   ├── RealTimeQuestProgress.tsx  # Real-time updates
│   │   └── SimpleWalletConnect.tsx  # Wallet connection
│   ├── hooks/              # Custom React hooks
│   │   └── useSomniaReactivity.ts  # Somnia Reactivity hook
│   ├── lib/                # Utility libraries
│   └── contracts/          # Smart contracts
│       └── QuestSystem.sol # Quest system contract
```

## ⚡ Somnia Reactivity Integration

### Real-time Event Handling

The app uses the `@somnia-chain/reactivity` SDK to subscribe to blockchain events:

```typescript
const { subscribeToQuestEvents, events } = useSomniaReactivity(userAddress)

// Subscribe to quest progress events
const subscription = await client.subscribe({
  filters: {
    address: userAddress,
    topics: ['QuestProgress', 'QuestCompleted', 'AchievementUnlocked']
  },
  onEvent: (event) => {
    // Update UI in real-time
    handleQuestEvent(event)
  }
})
```

### Smart Contract Events

The `QuestSystem.sol` contract emits events that are captured by Somnia Reactivity:

```solidity
event QuestProgressUpdated(address indexed user, uint256 indexed questId, uint256 progress);
event QuestCompleted(address indexed user, uint256 indexed questId, uint256 reward);
event AchievementUnlocked(address indexed user, string achievementType, uint256 rarity);
```

### Key Benefits

- **No Polling**: Events are pushed directly to the application
- **Atomic Updates**: Events + state from the same block
- **Low Latency**: Sub-second response times
- **Cost Efficient**: Pay only for actual event notifications

## 🎮 Demo Features

1. **Quest Dashboard**: View available quests with progress tracking
2. **Real-time Progress**: Watch progress bars update instantly
3. **Achievement Notifications**: Get instant alerts for completed quests
4. **Event Log**: See real-time blockchain events as they arrive
5. **Connection Status**: Monitor Somnia Reactivity connectivity

## 🏆 Hackathon Submission

This project was built for the **Somnia Reactivity Mini Hackathon** and demonstrates:

- ✅ **Technical Excellence**: Clean React architecture with real-time updates
- ✅ **Real-time UX**: Instant progress updates without polling
- ✅ **Somnia Integration**: Full deployment on Somnia testnet with SDK usage
- ✅ **Potential Impact**: Gamification framework other protocols can adopt

## 🔧 Configuration

### Somnia Testnet Setup

1. Get SOMI tokens from the [faucet](https://docs.somnia.network/developer/network-info)
2. Configure the RPC URL in the Somnia client
3. Deploy the QuestSystem contract to Somnia testnet
4. Set up event subscriptions for your user address

### Environment Variables

```env
NEXT_PUBLIC_SOMNIA_RPC_URL=https://testnet.somnia.network
NEXT_PUBLIC_PROJECT_ID=your-project-id
```

## 🚀 Deployment

### Deploy to Somnia Testnet

1. Compile the smart contract:
```bash
npx hardhat compile
```

2. Deploy to Somnia testnet:
```bash
npx hardhat run scripts/deploy.js --network somniaTestnet
```

3. Update the contract address in your frontend

### Deploy Frontend

```bash
npm run build
npm start
```

## 📖 Documentation

- [Somnia Reactivity Docs](https://docs.somnia.network/developer/reactivity)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Somnia Reactivity Mini Hackathon 2026**
