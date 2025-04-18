# DocuChain – Blockchain dApp to Verify Offer Letters

**DocuChain** is a decentralized application (dApp) that enables educational institutions and employers to issue tamper-proof offer letters on the blockchain. It allows applicants and immigration officers to instantly verify the authenticity of uploaded documents using a cryptographic hash, without any need to contact the issuer.

---

## Features

- Issue verifiable offer letters via authorized issuer dashboard
- Blockchain-based storage of file hash and metadata
- Public verification portal for anyone to upload and check offer letters
- UUPS upgradeable smart contract deployed on **Polygon Amoy Testnet**
- Frontend hosted on **Vercel**, backend on **Railway**

---

## Tech Stack

| Layer          | Technology |
|----------------|------------|
| **Frontend**   | React, Material UI, Vercel |
| **Backend**    | Node.js, ethers.js, Railway |
| **Blockchain** | Solidity (UUPS Upgradeable), Polygon Amoy Testnet, Alchemy |
| **Auth**       | Email, Firebase, (JSON file for MVP) |
| **Hashing**    | Keccak-256 (client-side + on-chain)

---

## How It Works

1. **Issuer logs in**  → gets access to issuance dashboard
2. **Uploads PDF** → frontend hashes file using Keccak-256
3. **Submits form** → backend calls smart contract `issueOfferLetter()`
4. **Smart contract** stores hash and metadata on Polygon
5. **Verifier uploads PDF** on public page → hash is recomputed and checked via `isLetterValid()`

---

MVP Link - https://docu-chain.vercel.app/


