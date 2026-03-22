'use client'

import { useState, useEffect } from 'react'
import { Trophy, Target, Zap, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestCard } from '@/components/QuestCard'
import { RealTimeQuestProgress } from '@/components/RealTimeQuestProgress'
import { SimpleWalletConnect } from '@/components/SimpleWalletConnect'
import { contractService, tokenService } from '@/lib/contract'

const mockQuests = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first blockchain transaction',
    reward: 10,
    progress: 0,
    total: 1,
    difficulty: 'Easy' as const,
    participants: 1234,
    started: false,
    completed: false,
  },
  {
    id: '2',
    title: 'Swap Master',
    description: 'Complete 5 token swaps on DEX',
    reward: 25,
    progress: 0,
    total: 5,
    difficulty: 'Medium' as const,
    participants: 567,
    started: false,
    completed: false,
  },
  {
    id: '3',
    title: 'Liquidity Provider',
    description: 'Provide liquidity to any pool',
    reward: 50,
    progress: 0,
    total: 1,
    difficulty: 'Hard' as const,
    participants: 89,
    started: false,
    completed: false,
  },
  {
    id: '4',
    title: 'Daily Trader',
    description: 'Make at least one transaction every day for 7 days',
    reward: 30,
    progress: 0,
    total: 7,
    difficulty: 'Medium' as const,
    participants: 234,
    started: false,
    completed: false,
  },
]

export default function Home() {
  const [quests, setQuests] = useState(mockQuests)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [somiBalance, setSomiBalance] = useState('0')

  useEffect(() => {
    // Check if wallet is connected
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          
          // Initialize token service and get balance
          await tokenService.initialize()
          const balance = await tokenService.getFormattedBalance()
          setSomiBalance(balance)
          
          loadQuestProgress(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const loadQuestProgress = async (userAddress: string) => {
    if (!window.ethereum) return

    try {
      // This would be real contract calls in production
      console.log('Loading real quest progress from blockchain for:', userAddress)
      
      // Mock: Simulate loading from blockchain
      setQuests(prev => prev.map(quest => ({
        ...quest,
        progress: 0 // Start fresh from blockchain
      })))
    } catch (error) {
      console.error('Error loading quest progress:', error)
    }
  }

  const startQuestOnChain = async (questId: string) => {
    if (!account || !window.ethereum) {
      alert('Please connect your wallet first!')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Starting quest on blockchain...')
      
      // Initialize contract service
      await contractService.initialize()
      
      // Start quest on real blockchain
      const result = await contractService.startQuest(parseInt(questId))
      
      console.log('Quest started successfully:', result)
      
      // Update local state after successful transaction
      setQuests(prev => prev.map(quest => {
        if (quest.id === questId) {
          return {
            ...quest,
            progress: 1,
            started: true
          }
        }
        return quest
      }))

      const explorerUrl = contractService.getExplorerUrl(result.transactionHash)
      alert(`✅ Quest "${questId}" started on Somnia Testnet!\n\nTransaction: ${result.transactionHash.slice(0, 10)}...\n\nView on Explorer: ${explorerUrl}`)
      
    } catch (error: any) {
      console.error('Error starting quest:', error)
      
      if (error.code === 4001) {
        alert('Transaction rejected by user.')
      } else if (error.code === -32603 || error.message?.includes('contract not deployed')) {
        alert('Smart contract not deployed yet. This is a demo mode.\n\nIn production, the contract would be deployed to Somnia Testnet.')
      } else {
        alert(`Failed to start quest: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const completeQuestOnChain = async (questId: string) => {
    if (!account || !window.ethereum) {
      alert('Please connect your wallet first!')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Completing quest on blockchain...')
      
      // Initialize contract service
      await contractService.initialize()
      
      // Complete quest on real blockchain
      const result = await contractService.completeQuest(parseInt(questId))
      
      console.log('Quest completed successfully:', result)
      
      // Update local state
      const quest = quests.find(q => q.id === questId)
      if (quest) {
        setQuests(prev => prev.map(q => {
          if (q.id === questId) {
            return {
              ...q,
              progress: q.total,
              completed: true
            }
          }
          return q
        }))

        const explorerUrl = contractService.getExplorerUrl(result.transactionHash)
        alert(`🎉 Quest "${quest.title}" completed on Somnia Testnet!\n\nReward: ${quest.reward} SOMI tokens\n\nTransaction: ${result.transactionHash.slice(0, 10)}...\n\nView on Explorer: ${explorerUrl}`)
      }
      
    } catch (error: any) {
      console.error('Error completing quest:', error)
      
      if (error.code === 4001) {
        alert('Transaction rejected by user.')
      } else if (error.code === -32603) {
        alert('Please switch to Somnia Testnet in your wallet.')
      } else {
        alert(`Failed to complete quest: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Reactive Quest System
            </h1>
          </div>
          <SimpleWalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Complete Quests, Earn Rewards
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience blockchain gamification with real-time updates powered by Somnia Reactivity. 
            <span className="block mt-2 text-purple-600 font-semibold">
              No polling required - instant updates guaranteed!
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active Quests</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4</div>
              <p className="text-xs text-gray-600">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Achievements</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-600">Unlocked</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Rewards</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{somiBalance}</div>
              <p className="text-xs text-gray-600">SOMI tokens</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Ranking</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">#42</div>
              <p className="text-xs text-gray-600">Among 1,250 players</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Quests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isLoading={isLoading}
                onStart={quest.started ? completeQuestOnChain : startQuestOnChain}
              />
            ))}
          </div>
        </div>

        {/* Somnia Reactivity Real-time Section */}
        <div className="mt-12 space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              Real-time Quest Updates
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience instant quest progress updates powered by Somnia Reactivity - no polling required!
            </p>
          </div>
          
          <RealTimeQuestProgress userAddress="0x1234...5678" />
        </div>
      </main>
    </div>
  )
}
