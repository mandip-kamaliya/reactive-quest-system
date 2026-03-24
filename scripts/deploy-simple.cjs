// Simple deployment script that creates contract-info.json
const fs = require("fs");

// Mock deployed contract info for demo
const contractInfo = {
  questSystem: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Demo address
    abi: [
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
      }
    ]
  },
  somiToken: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Demo SOMI token
    abi: [
      {
        "inputs": [
          {"internalType": "address", "name": "account", "type": "address"}
        ],
        "name": "balanceOf",
        "outputs": [
          {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "address", "name": "spender", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [
          {"internalType": "bool", "name": "", "type": "bool"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  network: "somnia-testnet",
  deployedAt: new Date().toISOString(),
  explorer: "https://testnet-explorer.somnia.network"
};

// Write contract info for frontend
fs.writeFileSync(
  "src/contract-info.json", 
  JSON.stringify(contractInfo, null, 2)
);

console.log("🎉 Contract info generated for demo mode!");
console.log("💾 Saved to src/contract-info.json");
console.log("🌐 Explorer: " + contractInfo.explorer);
console.log("🪙 SOMI Token: " + contractInfo.somiToken.address);
console.log("🎯 Quest System: " + contractInfo.questSystem.address);
console.log("✅ Ready for REAL blockchain integration!");
