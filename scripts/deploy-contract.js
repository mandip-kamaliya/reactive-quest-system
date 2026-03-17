const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("Deploying Quest System Contract...");
  
  const QuestSystem = await ethers.getContractFactory("QuestSystem");
  const questSystem = await QuestSystem.deploy();
  
  await questSystem.deployed();
  
  console.log("Quest System deployed to:", questSystem.address);
  console.log("Transaction hash:", questSystem.deployTransaction.hash);
  
  // Save contract address and ABI for frontend
  const fs = require("fs");
  const contractInfo = {
    address: questSystem.address,
    abi: require("../artifacts/contracts/QuestSystem.sol/QuestSystem.json").abi
  };
  
  fs.writeFileSync(
    "../src/contract-info.json", 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to src/contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
