'use client'

import { useState } from 'react'
import { Button } from './ui/button'

export function SimpleWalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = async () => {
    // Mock wallet connection for now
    setIsConnected(true)
    setAddress('0x1234...5678')
  }

  if (isConnected && address) {
    return (
      <Button variant="outline" className="font-mono text-sm">
        {address}
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect}>
      Connect Wallet
    </Button>
  )
}
