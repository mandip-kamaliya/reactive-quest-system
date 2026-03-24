const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying FULL Quest System with SOMI tokens...");
  
  // 1. Deploy Mock SOMI Token first
  console.log("🪙 Deploying Mock SOMI Token...");
  const MockSomiToken = await ethers.getContractFactory("MockSomiToken");
  const somiToken = await MockSomiToken.deploy();
  await somiToken.deployed();
  
  console.log("✅ SOMI Token deployed to:", somiToken.address);
  
  // 2. Deploy Quest System with SOMI token address
  console.log("🎯 Deploying Quest System...");
  const QuestSystem = await ethers.getContractFactory("QuestSystem");
  const questSystem = await QuestSystem.deploy(somiToken.address);
  await questSystem.deployed();
  
  console.log("✅ Quest System deployed to:", questSystem.address);
  
  // 3. Fund Quest System with SOMI tokens for rewards
  console.log("💰 Funding Quest System with SOMI tokens...");
  const totalRewards = ethers.utils.parseUnits("1000", 18); // 1000 SOMI for rewards
  await somiToken.fundQuestSystem(questSystem.address, totalRewards);
  console.log("✅ Funded with 1000 SOMI tokens for rewards");
  
  // 4. Create initial quests
  console.log("🎮 Creating initial quests...");
  
  const quests = [
    {
      title: "First Steps",
      description: "Complete your first blockchain transaction",
      reward: ethers.utils.parseUnits("50", 18), // 50 SOMI tokens
      totalSteps: 1,
      difficulty: 1
    },
    {
      title: "Swap Master", 
      description: "Complete 5 token swaps on DEX",
      reward: ethers.utils.parseUnits("100", 18), // 100 SOMI tokens
      totalSteps: 5,
      difficulty: 2
    },
    {
      title: "Liquidity Provider",
      description: "Provide liquidity to any pool", 
      reward: ethers.utils.parseUnits("200", 18), // 200 SOMI tokens
      totalSteps: 1,
      difficulty: 3
    },
    {
      title: "Daily Trader",
      description: "Make at least one transaction every day for 7 days",
      reward: ethers.utils.parseUnits("150", 18), // 150 SOMI tokens
      totalSteps: 7,
      difficulty: 2
    }
  ];
  
  // Create quests
  for (let i = 0; i < quests.length; i++) {
    const quest = quests[i];
    const tx = await questSystem.createQuest(
      quest.title,
      quest.description,
      quest.reward,
      quest.totalSteps,
      quest.difficulty
    );
    await tx.wait();
    console.log(`✅ Created quest ${i + 1}: ${quest.title} (${ethers.utils.formatUnits(quest.reward, 18)} SOMI)`);
  }
  
  // 5. Save contract info for frontend
  const contractInfo = {
    questSystem: {
      address: questSystem.address,
      abi: require("../artifacts/contracts/QuestSystem.sol/QuestSystem.json").abi
    },
    somiToken: {
      address: somiToken.address,
      abi: require("../artifacts/contracts/MockSomiToken.sol/MockSomiToken.json").abi
    },
    network: "somnia-testnet",
    deployedAt: new Date().toISOString(),
    explorer: "https://testnet-explorer.somnia.network"
  };
  
  fs.writeFileSync(
    "../src/contract-info.json", 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("💾 Contract info saved to src/contract-info.json");
  console.log("🎉 FULL Quest System is now LIVE on Somnia Testnet!");
  console.log("🌐 Quest System:", contractInfo.explorer + "/address/" + questSystem.address);
  console.log("🪙 SOMI Token:", contractInfo.explorer + "/address/" + somiToken.address);
  console.log("💰 Users can now earn REAL SOMI tokens!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
