const { ethers } = require("hardhat");

async function main() {
  const proxyAddress = "0xbb16b37250bd5d34d2f2ec842e02d81bc0b057b8"; // replace with actual

  const [signer] = await ethers.getSigners();
  const OfferLetterVerifier = await ethers.getContractFactory("OfferLetterVerifier", signer);
  const contract = OfferLetterVerifier.attach(proxyAddress);

  const fileHash = "0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000";
  const isValid = await contract.isLetterValid(fileHash);

  console.log("Letter valid:", isValid);
  const details = await contract.getLetterDetails(fileHash);
console.log("Details:", details);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
