const { ethers } = require("hardhat");

async function main() {
  const proxyAddress = "0xbb16b37250bd5d34d2f2ec842e02d81bc0b057b8"; // replace with your proxy address
  const [signer] = await ethers.getSigners();

  const OfferLetterVerifier = await ethers.getContractFactory("OfferLetterVerifier", signer);
  const contract = OfferLetterVerifier.attach(proxyAddress);

  // 🧾 Replace these values with actual ones if needed
  const studentHash = "0x62cb69cb38f8ac5b5dd6f9bbd4033a8cb4ddcfc2bc9ae8b3ddc12c131e3b65cd";
  const fileHash = "0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000"; // new one for testing
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days from now

  const tx = await contract.issueOfferLetter(studentHash, fileHash, expiry);
  await tx.wait();

  console.log("✅ Offer letter issued!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
