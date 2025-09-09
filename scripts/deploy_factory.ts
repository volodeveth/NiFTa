import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const platform = process.env.PLATFORM_TREASURY;
  if (!platform) {
    throw new Error("PLATFORM_TREASURY not set in environment");
  }

  const priceWei = ethers.parseEther("0.0001");
  const trigger = 1000;

  console.log("Deploying NiFTa Collection implementation...");
  const Collection = await ethers.getContractFactory("NiftaCollection1155");
  const collectionImpl = await Collection.deploy();
  await collectionImpl.waitForDeployment();
  const collectionImplAddress = await collectionImpl.getAddress();
  console.log("Collection implementation deployed at:", collectionImplAddress);

  console.log("Deploying NiFTa Factory...");
  const Factory = await ethers.getContractFactory("NiftaFactory");
  const factory = await upgrades.deployProxy(
    Factory,
    [collectionImplAddress, platform, priceWei, trigger],
    { initializer: "initialize" }
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("Factory deployed at:", factoryAddress);

  // Verify contracts on BaseScan (if not local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId === 8453) {
    console.log("Waiting before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: collectionImplAddress,
        constructorArguments: [],
      });
    } catch (e) {
      console.log("Collection verification failed:", e.message);
    }

    try {
      await hre.run("verify:verify", {
        address: factoryAddress,
        constructorArguments: [],
      });
    } catch (e) {
      console.log("Factory verification failed:", e.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Collection Implementation:", collectionImplAddress);
  console.log("Factory Proxy:", factoryAddress);
  console.log("Platform Treasury:", platform);
  console.log("Default Price (Wei):", priceWei.toString());
  console.log("Default Trigger:", trigger);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });