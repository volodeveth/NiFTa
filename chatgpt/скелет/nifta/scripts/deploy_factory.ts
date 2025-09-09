import { ethers } from "hardhat";

async function main() {
  const platform = process.env.PLATFORM_TREASURY!;
  const priceWei = ethers.parseEther("0.0001");
  const trigger = 1000;

  const Coll = await ethers.getContractFactory("NiftaCollection1155");
  const collImpl = await Coll.deploy();
  await collImpl.waitForDeployment();

  const Factory = await ethers.getContractFactory("NiftaFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  const tx = await factory.initialize(await collImpl.getAddress(), platform, priceWei, trigger);
  await tx.wait();

  console.log("Collection impl:", await collImpl.getAddress());
  console.log("Factory:", await factory.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
