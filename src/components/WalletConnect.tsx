'use client'

import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { Button } from './ui/button'

export function WalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  if (isConnected && address) {
    return (
      <Button variant="outline" className="font-mono text-sm">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={() => open()}>
      Connect Wallet
    </Button>
  )
}
