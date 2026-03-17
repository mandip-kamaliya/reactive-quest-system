'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useSomniaReactivity } from '@/hooks/useSomniaReactivity'
import { Zap, Trophy, Bell, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

// Inline Badge component to avoid import issues
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  children: React.ReactNode
}

function Badge({ variant = 'default', className, children }: BadgeProps) {
  const variantClasses = {
    default: 'bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
    secondary: 'bg-gray-100 text-gray-800 border-0 shadow-md',
    destructive: 'bg-red-500 text-white border-0 shadow-md hover:shadow-lg',
    outline: 'bg-white border border-gray-300 text-gray-700 shadow-md'
  }
  
  return (
    <div className={cn(
      'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300',
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  )
}

interface RealTimeQuestProgressProps {
  userAddress?: string
}

export function RealTimeQuestProgress({ userAddress }: RealTimeQuestProgressProps) {
  const { isConnected, events, lastUpdate, simulateQuestProgress } = useSomniaReactivity(userAddress)
  const [quests, setQuests] = useState([
    { id: '1', title: 'First Steps', progress: 0, total: 1, status: 'active' },
    { id: '2', title: 'Swap Master', progress: 2, total: 5, status: 'active' },
    { id: '3', title: 'Liquidity Provider', progress: 0, total: 7, status: 'active' },
    { id: '4', title: 'Daily Trader', progress: 3, total: 7, status: 'active' }
  ])

  // Update quest progress based on Somnia events
  useEffect(() => {
    const latestEvent = events[0]
    if (latestEvent) {
      setQuests(prev => prev.map(quest => {
        if (quest.id === latestEvent.questId) {
          return {
            ...quest,
            progress: latestEvent.data.progress || quest.progress,
            status: latestEvent.eventType === 'completed' ? 'completed' : quest.status
          }
        }
        return quest
      }))
    }
  }, [events])

  const handleSimulateProgress = (questId: string) => {
    console.log('Simulating progress for quest:', questId)
    
    const quest = quests.find(q => q.id === questId)
    if (quest && quest.progress < quest.total) {
      const newProgress = Math.min(quest.progress + 1, quest.total)
      
      // Update local state immediately
      setQuests(prev => prev.map(q => {
        if (q.id === questId) {
          const updatedQuest = {
            ...q,
            progress: newProgress,
            status: newProgress >= q.total ? 'completed' : 'active'
          }
          
          // Show completion notification
          if (newProgress >= q.total) {
            console.log(`🎉 Quest ${questId} completed! Reward: 25 SOMI`)
            // You could add a toast notification here
          }
          
          return updatedQuest
        }
        return q
      }))
      
      // Also call the reactivity simulation
      simulateQuestProgress(questId, newProgress)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'active': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'In Progress'
      default: return 'Not Started'
    }
  }

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-lg font-semibold">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {lastUpdate > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Activity className="w-4 h-4" />
                <span className="text-sm">
                  Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-blue-100 rounded-lg">
              <span className="text-blue-800 font-medium">
                Somnia Reactivity Status
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {isConnected ? '✅ Real-time events active' : '❌ Connection lost'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Quest Progress */}
      <div className="grid gap-6">
        <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-800">
          <Zap className="w-6 h-6 text-yellow-500" />
          Real-time Quest Progress
        </h3>
        
        {quests.map((quest) => (
          <Card key={quest.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">{quest.title}</CardTitle>
                <Badge className={getStatusColor(quest.status)}>
                  {getStatusText(quest.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-800 font-medium">{quest.progress}/{quest.total}</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={(quest.progress / quest.total) * 100} 
                    className="h-3"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  onClick={() => handleSimulateProgress(quest.id)}
                  disabled={quest.progress >= quest.total}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {quest.progress >= quest.total ? '✅ Completed' : '⚡ Simulate Progress'}
                </Button>
                
                {quest.status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-bold">
                      +25 SOMI
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Real-time indicator */}
            {events.some(e => e.questId === quest.id) && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
                  <Bell className="w-3 h-3" />
                  <span className="font-medium">LIVE</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {events.slice(0, 8).map((event, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-gray-800 font-medium">Quest {event.questId}</span>
                    <Badge variant="outline" className="text-xs">
                      {event.eventType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
