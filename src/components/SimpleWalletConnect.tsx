'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'

export function SimpleWalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [walletType, setWalletType] = useState<string>('')

  useEffect(() => {
    // Check if wallet is already connected on mount
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Check for MetaMask
        if (window.ethereum && window.ethereum.isMetaMask) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0])
            setWalletType('MetaMask')
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectMetaMask = async () => {
    if (typeof window === 'undefined') return
    
    // Better MetaMask detection
    const isMetaMaskInstalled = () => {
      return typeof window !== 'undefined' && 
             typeof window.ethereum !== 'undefined' && 
             (window.ethereum.isMetaMask === true || 
              window.ethereum.constructor.name === 'Object' ||
              window.ethereum.constructor.name === 'EthereumProvider')
    }
    
    if (!isMetaMaskInstalled()) {
      showWalletOptions()
      return
    }

    try {
      setIsLoading(true)
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(accounts[0])
        setWalletType('MetaMask')
        console.log('Connected to MetaMask:', accounts[0])
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error)
      if (error.code === 4001) {
        // User rejected the request
        alert('Connection rejected by user.')
      } else if (error.message?.includes('MetaMask extension not found')) {
        showWalletOptions()
      } else {
        alert('Failed to connect to wallet. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined') return
    
    // Try MetaMask first
    if (window.ethereum && window.ethereum.isMetaMask) {
      await connectMetaMask()
      return
    }
    
    // Try other providers
    if (window.ethereum) {
      await connectMetaMask()
      return
    }
    
    // No wallet found, show installation options
    showWalletOptions()
  }

  const connectWalletConnect = async () => {
    try {
      setIsLoading(true)
      // WalletConnect implementation would go here
      console.log('WalletConnect connection not implemented yet')
      setIsLoading(false)
    } catch (error) {
      console.error('Error connecting to WalletConnect:', error)
      setIsLoading(false)
    }
  }

  const showWalletOptions = () => {
    const message = `No wallet detected! Please install one of the following wallets:
    
1. MetaMask (Recommended): https://metamask.io/download/
2. Coinbase Wallet: https://wallet.coinbase.com/
3. Trust Wallet: https://trustwallet.com/

After installation, refresh this page and try again.`
    
    alert(message)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
    setWalletType('')
    console.log('Wallet disconnected!')
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">
            {walletType}
          </span>
          <span className="font-mono text-sm text-green-800">
            {formatAddress(address)}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDisconnect} 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={connectWallet} 
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Connecting...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          🔗 Connect Wallet
        </div>
      )}
    </Button>
  )
}

