import { ethers } from 'ethers'
import { CONTRACT_INFO } from './contract-info'

// Contract ABI and address from deployed contracts
export const QUEST_SYSTEM_ABI = CONTRACT_INFO.questSystem.abi
export const QUEST_SYSTEM_ADDRESS = CONTRACT_INFO.questSystem.address
export const SOMI_TOKEN_ABI = CONTRACT_INFO.somiToken.abi
export const SOMI_TOKEN_ADDRESS = CONTRACT_INFO.somiToken.address

// Network configurations
export const NETWORKS = {
  SOMNIA_TESTNET: {
    chainId: '0x1e9', // 481 in decimal
    name: 'Somnia Testnet',
    rpcUrl: 'https://testnet.somnia.network',
    explorerUrl: 'https://testnet-explorer.somnia.network'
  },
  HARDHAT: {
    chainId: '0x7a69', // 31337 in decimal
    name: 'Hardhat Network',
    rpcUrl: 'http://127.0.0.1:8545'
  }
}

// ERC20 Token ABI for SOMI token
export const ERC20_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

export class ContractService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private questSystemContract: ethers.Contract | null = null

  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      // Switch to Somnia Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.SOMNIA_TESTNET.chainId }]
      }).catch(async (error: any) => {
        // If network doesn't exist, add it
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: NETWORKS.SOMNIA_TESTNET.chainId,
                chainName: NETWORKS.SOMNIA_TESTNET.name,
                rpcUrls: [NETWORKS.SOMNIA_TESTNET.rpcUrl],
                blockExplorerUrls: [NETWORKS.SOMNIA_TESTNET.explorerUrl]
              }
            ]
          })
        }
      })

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      this.questSystemContract = new ethers.Contract(
        QUEST_SYSTEM_ADDRESS,
        QUEST_SYSTEM_ABI,
        this.signer
      )

      console.log('Contract initialized:', QUEST_SYSTEM_ADDRESS)
      return true
    } catch (error) {
      console.error('Failed to initialize contract:', error)
      throw error
    }
  }

  async startQuest(questId: number) {
    if (!this.questSystemContract || !this.signer) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.questSystemContract.startQuest(questId)
      console.log('Quest started transaction:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Quest started confirmed:', receipt)
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error: any) {
      console.error('Failed to start quest:', error)
      
      // Handle contract not deployed yet
      if (error.message?.includes('call revert exception') || 
          error.message?.includes('execution reverted') ||
          error.code === -32603) {
        throw new Error('Smart contract not deployed yet. Please deploy the contract first.')
      }
      
      throw error
    }
  }

  async updateQuestProgress(questId: number, steps: number) {
    if (!this.questSystemContract || !this.signer) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.questSystemContract.updateQuestProgress(questId, steps)
      console.log('Progress updated transaction:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Progress updated confirmed:', receipt)
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error: any) {
      console.error('Failed to update progress:', error)
      throw error
    }
  }

  async completeQuest(questId: number) {
    if (!this.questSystemContract || !this.signer) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.questSystemContract.completeQuest(questId)
      console.log('Quest completed transaction:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Quest completed confirmed:', receipt)
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error: any) {
      console.error('Failed to complete quest:', error)
      throw error
    }
  }

  async getQuest(questId: number) {
    if (!this.questSystemContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const quest = await this.questSystemContract.getQuest(questId)
      return quest
    } catch (error: any) {
      console.error('Failed to get quest:', error)
      throw error
    }
  }

  async getUserQuest(userAddress: string, questId: number) {
    if (!this.questSystemContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const userQuest = await this.questSystemContract.getUserQuest(userAddress, questId)
      return userQuest
    } catch (error: any) {
      console.error('Failed to get user quest:', error)
      throw error
    }
  }

  async getActiveQuests() {
    if (!this.questSystemContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const activeQuests = await this.questSystemContract.getActiveQuests()
      return activeQuests
    } catch (error: any) {
      console.error('Failed to get active quests:', error)
      throw error
    }
  }

  async getUserCompletedQuests(userAddress: string) {
    if (!this.questSystemContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const completedQuests = await this.questSystemContract.getUserCompletedQuests(userAddress)
      return completedQuests
    } catch (error: any) {
      console.error('Failed to get completed quests:', error)
      throw error
    }
  }

  getContractAddress() {
    return QUEST_SYSTEM_ADDRESS
  }

  getExplorerUrl(txHash: string) {
    return `${NETWORKS.SOMNIA_TESTNET.explorerUrl}/tx/${txHash}`
  }
}

export class TokenService {
  private provider: ethers.BrowserProvider | null = null
  private somiTokenContract: ethers.Contract | null = null

  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    this.provider = new ethers.BrowserProvider(window.ethereum)
    this.somiTokenContract = new ethers.Contract(
      SOMI_TOKEN_ADDRESS,
      SOMI_TOKEN_ABI,
      await this.provider.getSigner()
    )

    console.log('SOMI Token initialized:', SOMI_TOKEN_ADDRESS)
    return true
  }

  async getTokenBalance(address: string) {
    if (!this.somiTokenContract) {
      throw new Error('Token contract not initialized')
    }

    try {
      const balance = await this.somiTokenContract.balanceOf(address)
      return ethers.formatUnits(balance, 18) // Convert from wei to SOMI
    } catch (error: any) {
      console.error('Failed to get token balance:', error)
      return '0'
    }
  }

  async getFormattedBalance() {
    if (!window.ethereum) return '0'
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length === 0) return '0'
      
      return await this.getTokenBalance(accounts[0])
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }
}

export const contractService = new ContractService()
export const tokenService = new TokenService()

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
