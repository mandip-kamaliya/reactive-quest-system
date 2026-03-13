'use client'

import { SimpleWalletConnect } from '@/components/SimpleWalletConnect'
import { QuestCard } from '@/components/QuestCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, Zap, Users } from 'lucide-react'

const mockQuests = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first blockchain transaction',
    reward: 10,
    progress: 0,
    total: 1,
    difficulty: 'Easy' as const,
    participants: 1250,
  },
  {
    id: '2',
    title: 'Swap Master',
    description: 'Perform 5 token swaps on DEX',
    reward: 25,
    progress: 2,
    total: 5,
    difficulty: 'Medium' as const,
    deadline: '2 days left',
    participants: 450,
  },
  {
    id: '3',
    title: 'Liquidity Provider',
    description: 'Provide liquidity to any pool for 7 days',
    reward: 50,
    progress: 0,
    total: 7,
    difficulty: 'Hard' as const,
    deadline: '5 days left',
    participants: 89,
  },
  {
    id: '4',
    title: 'Daily Trader',
    description: 'Make at least one transaction every day for 7 days',
    reward: 30,
    progress: 3,
    total: 7,
    difficulty: 'Medium' as const,
    participants: 234,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Reactive Quest System
            </h1>
          </div>
          <SimpleWalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Complete Quests, Earn Rewards
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience blockchain gamification with real-time updates powered by Somnia Reactivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Quests</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Available now</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Total achievements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">SOMI tokens</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#42</div>
              <p className="text-xs text-muted-foreground">Among 1,250 players</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Quests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onStart={(questId) => console.log('Starting quest:', questId)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
