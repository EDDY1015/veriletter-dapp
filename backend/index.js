const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { keccak256, toUtf8Bytes } = require("ethers");
const { ethers } = require("ethers");
const multer = require("multer");
const upload = multer();
require("dotenv").config();

const ABI = require("./VeriLetterABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcURL = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const DB_PATH = "./issuer.json";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 📌 Hashing helpers
function hashStudentInfo(passport) {
  return keccak256(toUtf8Bytes(passport.trim().toUpperCase()));
}
function hashFile(buffer) {
  return keccak256(buffer);
}

// 📄 Issue Letter
app.post("/issue", upload.single("file"), async (req, res) => {
  try {
    const { email, firstName, lastName, passport, expiryDate } = req.body;
    const fileBuffer = req.file?.buffer;

    if (!email || !passport || !expiryDate || !fileBuffer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const issuerData = JSON.parse(fs.readFileSync(DB_PATH));
    const entry = issuerData[email.toLowerCase()];
    if (!entry) return res.status(404).json({ error: "Issuer not found" });

    const subjectIdHash = hashStudentInfo(passport);
    const fileHash = hashFile(fileBuffer);
    const expiry = Math.floor(new Date(expiryDate).getTime() / 1000);
    const issuerId = entry.issuerId;

    const provider = new ethers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const existing = await contract.getLetterDetails(fileHash).catch(() => null);
    if (existing && existing.issuerWallet !== ethers.ZeroAddress) {
      return res.status(400).json({ error: "Letter with this file already exists" });
    }

    const tx = await contract.issueOfferLetter(issuerId, subjectIdHash, fileHash, expiry, {
      gasLimit: 300000,
    });
    await tx.wait();

    // Update quota
    entry.quotaUsed += 1;
    fs.writeFileSync(DB_PATH, JSON.stringify(issuerData, null, 2));

    // Save off-chain data
    const issuedDataPath = "./issued.json";
    let issuedData = [];
    if (fs.existsSync(issuedDataPath)) {
      issuedData = JSON.parse(fs.readFileSync(issuedDataPath));
    }
    issuedData.push({
      fileHash,
      subjectIdHash,
      firstName,
      lastName,
      passport,
      issuerId,
      issueDate: Math.floor(Date.now() / 1000),
      expiryDate: expiry,
    });
    fs.writeFileSync(issuedDataPath, JSON.stringify(issuedData, null, 2));

    res.json({ success: true, fileHash });
  } catch (err) {
    console.error("Issue failed:", err);
    res.status(500).json({ error: err.reason || err.message || "Failed to issue letter" });
  }
});

// 🔐 Dummy login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const validUsers = {
    "admin@college.com": "admin",
    "admin@mail.com": "admin",
    "admin@gbc.com": "admin",
  };

  if (validUsers[email] && validUsers[email] === password) {
    return res.json({ success: true, email });
  }

  return res.status(401).json({ success: false, error: "Invalid credentials" });
});

// 📦 Quota
app.get("/issuer/:email", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const email = req.params.email.toLowerCase();
  if (data[email]) {
    res.json(data[email]);
  } else {
    res.status(404).json({ error: "Issuer not found" });
  }
});

app.post("/issuer/:email/increment", (req, res) => {
  const email = req.params.email.toLowerCase();
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  if (!data[email]) return res.status(404).json({ error: "Issuer not found" });

  data[email].quotaUsed += 1;
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.json({ success: true, quotaUsed: data[email].quotaUsed });
});

// 🧾 List all issued letters (off-chain)
app.get("/issued", (req, res) => {
  const issuedPath = "./issued.json";
  if (!fs.existsSync(issuedPath)) return res.json([]);
  const issued = JSON.parse(fs.readFileSync(issuedPath));
  res.json(issued);
});

// 🔍 Wallet to name
app.get("/issuer-by-wallet/:wallet", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const wallet = req.params.wallet.toLowerCase();
  const match = Object.values(data).find(
    (entry) => entry.wallet?.toLowerCase() === wallet
  );
  if (match) {
    res.json({ name: match.name });
  } else {
    res.status(404).json({ name: "Unknown Issuer" });
  }
});

// 📤 Get issued letters for a specific issuer
app.get("/issued/:issuerId", (req, res) => {
  const issuerId = req.params.issuerId.toLowerCase();
  const issuedDataPath = "./issued.json";

  if (!fs.existsSync(issuedDataPath)) {
    return res.json([]);
  }

  const allIssued = JSON.parse(fs.readFileSync(issuedDataPath));
  const filtered = allIssued.filter(
    (l) => l.issuerId.toLowerCase() === issuerId
  );

  res.json(filtered);
});


// 🚀 Start
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
