import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const platform = process.env.PLATFORM_TREASURY;
  if (!platform) {
    throw new Error("PLATFORM_TREASURY not set in environment");
  }

  console.log("Deploying NiFTa Marketplace...");
  const Marketplace = await ethers.getContractFactory("NiftaMarketplace");
  const marketplace = await Marketplace.deploy(platform);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed at:", marketplaceAddress);

  // Verify contract on BaseScan (if not local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId === 8453) {
    console.log("Waiting before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [platform],
      });
      console.log("Marketplace verified on BaseScan");
    } catch (e) {
      console.log("Marketplace verification failed:", e.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Marketplace:", marketplaceAddress);
  console.log("Platform Treasury:", platform);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });