import { ethers } from "hardhat";

async function main() {
  // Deploying CappedSet contract
  const CappedSet = await ethers.getContractFactory("CappedSet");
  const numElements = 10; // Specify the desired number of elements
  const cappedSet = await CappedSet.deploy(numElements);
  await cappedSet.deployed();

  console.log("CappedSet contract deployed to:", cappedSet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
