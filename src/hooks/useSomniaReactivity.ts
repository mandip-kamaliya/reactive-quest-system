'use client'

import { useEffect, useState, useCallback } from 'react'
import { Reactivity } from '@somnia-chain/reactivity'

interface QuestEvent {
  questId: string
  userId: string
  eventType: 'progress' | 'completed' | 'started'
  data: any
  timestamp: number
}

interface SomniaReactivityState {
  isConnected: boolean
  events: QuestEvent[]
  lastUpdate: number
}

export function useSomniaReactivity(userAddress?: string) {
  const [state, setState] = useState<SomniaReactivityState>({
    isConnected: false,
    events: [],
    lastUpdate: 0
  })
  const [client, setClient] = useState<any>(null)

  // Initialize Somnia Reactivity client
  useEffect(() => {
    const initClient = async () => {
      try {
        // For demo purposes, create a mock client that simulates Somnia Reactivity
        // In production, this would be: new Reactivity(config)
        const mockReactivityClient = {
          subscribe: async (options: any) => {
            console.log('Mock subscription to quest events:', options)
            return {
              unsubscribe: () => console.log('Unsubscribed from quest events')
            }
          },
          isConnected: true
        }
        
        setClient(mockReactivityClient)
        setState(prev => ({ ...prev, isConnected: true }))
        
        console.log('Somnia Reactivity client initialized (mock for demo)')
      } catch (error) {
        console.error('Failed to initialize Somnia Reactivity:', error)
      }
    }

    initClient()
  }, [])

  // Subscribe to quest-related events
  const subscribeToQuestEvents = useCallback(async () => {
    if (!client || !userAddress) return

    try {
      // Subscribe to quest progress events for this user
      const subscription = await client.subscribe({
        filters: {
          // Filter events related to user's quests
          address: userAddress,
          topics: [
            'QuestProgress', // Event name
            'QuestCompleted', // Event name
            'AchievementUnlocked' // Event name
          ]
        },
        onEvent: (event: any) => {
          console.log('Received quest event:', event)
          
          const questEvent: QuestEvent = {
            questId: event.data.questId || 'unknown',
            userId: event.data.userId || userAddress,
            eventType: event.data.eventType || 'progress',
            data: event.data,
            timestamp: Date.now()
          }

          setState(prev => ({
            ...prev,
            events: [questEvent, ...prev.events].slice(0, 50), // Keep last 50 events
            lastUpdate: Date.now()
          }))

          // Trigger real-time UI updates
          handleQuestEvent(questEvent)
        }
      })

      return subscription
    } catch (error) {
      console.error('Failed to subscribe to quest events:', error)
    }
  }, [client, userAddress])

  // Handle different types of quest events
  const handleQuestEvent = useCallback((event: QuestEvent) => {
    switch (event.eventType) {
      case 'progress':
        console.log(`Quest ${event.questId} progress updated:`, event.data)
        // Update quest progress in real-time
        break
      case 'completed':
        console.log(`Quest ${event.questId} completed!`, event.data)
        // Show completion notification
        showAchievementNotification('Quest Completed!', event.data.reward)
        break
      case 'started':
        console.log(`Quest ${event.questId} started:`, event.data)
        // Update UI to show quest is active
        break
    }
  }, [])

  // Show achievement notification
  const showAchievementNotification = useCallback((title: string, reward: number) => {
    // Create a toast notification or popup
    console.log(`🎉 ${title} - Reward: ${reward} SOMI`)
    
    // You can integrate with a toast library here
    if (typeof window !== 'undefined') {
      // Simple browser notification for demo
      const notification = new Notification(title, {
        body: `You earned ${reward} SOMI tokens!`,
        icon: '/trophy-icon.png'
      })
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }, [])

  // Start subscription when user connects
  useEffect(() => {
    if (state.isConnected && userAddress && client) {
      subscribeToQuestEvents()
    }
  }, [state.isConnected, userAddress, client, subscribeToQuestEvents])

  // Simulate quest progress for demo
  const simulateQuestProgress = useCallback((questId: string, progress: number) => {
    if (!client) return

    const mockEvent: QuestEvent = {
      questId,
      userId: userAddress || 'demo-user',
      eventType: 'progress',
      data: { progress, total: 5 },
      timestamp: Date.now()
    }

    setState(prev => ({
      ...prev,
      events: [mockEvent, ...prev.events].slice(0, 50),
      lastUpdate: Date.now()
    }))

    handleQuestEvent(mockEvent)
  }, [client, userAddress, handleQuestEvent])

  return {
    ...state,
    client,
    simulateQuestProgress,
    subscribeToQuestEvents
  }
}
