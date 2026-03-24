const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying Quest System Contract to Somnia Testnet...");
  
  // Deploy Quest System
  const QuestSystem = await ethers.getContractFactory("QuestSystem");
  
  // Use a mock SOMI token address for now (you can replace with real SOMI token)
  const mockSomiToken = "0x0000000000000000000000000000000000000000000"; // Will be replaced with real SOMI
  
  const questSystem = await QuestSystem.deploy(mockSomiToken);
  await questSystem.deployed();
  
  console.log("✅ Quest System deployed to:", questSystem.address);
  console.log("📄 Transaction hash:", questSystem.deployTransaction.hash);
  
  // Create initial quests
  console.log("🎯 Creating initial quests...");
  
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
  
  // Create quests (only owner can do this)
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
    console.log(`✅ Created quest ${i + 1}: ${quest.title}`);
  }
  
  // Save contract info for frontend
  const contractInfo = {
    address: questSystem.address,
    abi: require("../artifacts/contracts/QuestSystem.sol/QuestSystem.json").abi,
    network: "somnia-testnet",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "../src/contract-info.json", 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("💾 Contract info saved to src/contract-info.json");
  console.log("🎉 Quest System is now LIVE on Somnia Testnet!");
  console.log("🌐 Explorer: https://testnet-explorer.somnia.network/address/" + questSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
