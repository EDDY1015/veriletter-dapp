import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { getVerifierWithSigner } from "../utils/contract";
import { ethers } from "ethers";

const IssueLetter = () => {
  const [pdf, setPdf] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [expiry, setExpiry] = useState("");
  const [status, setStatus] = useState("");

  const handleFile = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleIssue = async () => {
    if (!pdf || !studentId || !expiry) {
      return setStatus("❗️ All fields are required");
    }

    setStatus("⏳ Hashing and submitting...");

    const buffer = await pdf.arrayBuffer();
    const fileHash = "0x" + sha256(buffer);
    const studentHash = ethers.keccak256(ethers.toUtf8Bytes(studentId));
    const expiryTimestamp = Math.floor(new Date(expiry).getTime() / 1000);

    try {
      const contract = await getVerifierWithSigner();
      const tx = await contract.issueOfferLetter(studentHash, fileHash, expiryTimestamp);
      await tx.wait();

      setStatus("✅ Letter issued on-chain!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed: " + (err.reason || err.message));
    }
  };

  return (
    <div className="issue-form">
      <h2>Issue Offer Letter</h2>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      <input
        type="text"
        placeholder="Student ID (Name+Passport)"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />
      <button onClick={handleIssue}>Issue Letter</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default IssueLetter;
