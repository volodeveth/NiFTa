import { ethers } from "hardhat";

async function main() {
  const platform = process.env.PLATFORM_TREASURY!;
  const M = await ethers.getContractFactory("NiftaMarketplace");
  const m = await M.deploy(platform);
  await m.waitForDeployment();
  console.log("Marketplace:", await m.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });
