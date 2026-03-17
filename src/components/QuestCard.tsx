'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Clock, Users } from 'lucide-react'

interface Quest {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  total: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  deadline?: string
  participants?: number
  started?: boolean
  completed?: boolean
}

interface QuestCardProps {
  quest: Quest
  onStart?: (questId: string) => void
  isLoading?: boolean
}

export function QuestCard({ quest, onStart, isLoading }: QuestCardProps) {
  const progressPercentage = (quest.progress / quest.total) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{quest.title}</CardTitle>
            <CardDescription className="mt-2">{quest.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
              {quest.difficulty}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4" />
              {quest.reward} SOMI
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{quest.progress}/{quest.total}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {quest.deadline && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quest.deadline}
            </div>
          )}
          {quest.participants && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {quest.participants} joined
            </div>
          )}
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={() => {
            console.log('Quest button clicked:', quest.id)
            if (onStart) {
              onStart(quest.id)
            } else {
              console.log('No onStart handler provided')
            }
          }}
          disabled={quest.completed || isLoading}
        >
          {quest.completed ? '✅ Completed' : quest.started ? '⛓ Complete on Blockchain' : '⚡ Start on Blockchain'}
        </Button>
      </CardContent>
    </Card>
  )
}
