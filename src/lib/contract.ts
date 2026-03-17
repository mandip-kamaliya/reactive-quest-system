import { ethers } from 'ethers'

// Contract ABI - will be updated after deployment
export const QUEST_SYSTEM_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_questId", "type": "uint256"}
    ],
    "name": "startQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_questId", "type": "uint256"},
      {"internalType": "uint256", "name": "_stepsCompleted", "type": "uint256"}
    ],
    "name": "updateQuestProgress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_questId", "type": "uint256"}
    ],
    "name": "completeQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_questId", "type": "uint256"}
    ],
    "name": "getQuest",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "reward", "type": "uint256"},
          {"internalType": "uint256", "name": "totalSteps", "type": "uint256"},
          {"internalType": "uint256", "name": "difficulty", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "participantCount", "type": "uint256"}
        ],
        "internalType": "struct QuestSystem.Quest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "uint256", "name": "_questId", "type": "uint256"}
    ],
    "name": "getUserQuest",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "questId", "type": "uint256"},
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "uint256", "name": "currentStep", "type": "uint256"},
          {"internalType": "bool", "name": "isCompleted", "type": "bool"},
          {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
          {"internalType": "uint256", "name": "completedAt", "type": "uint256"}
        ],
        "internalType": "struct QuestSystem.UserQuest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveQuests",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "getUserCompletedQuests",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Contract address - temporary test address (will be updated after deployment)
export const QUEST_SYSTEM_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

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

export const contractService = new ContractService()

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
