import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { getVerifierContract } from "../utils/contract";

const FileUpload = ({ setLetterData }) => {
  const [status, setStatus] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("Hashing...");

    const buffer = await file.arrayBuffer();
    const fileHash = "0x" + sha256(buffer);

    const contract = getVerifierContract();

    try {
      const isValid = await contract.isLetterValid(fileHash);
      const details = await contract.getLetterDetails(fileHash);

      setLetterData({
        isValid,
        fileHash,
        issuer: details.issuer,
        issueDate: new Date(details.issueDate * 1000).toLocaleDateString(),
        expiryDate: new Date(details.expiryDate * 1000).toLocaleDateString(),
        revoked: details.revoked,
      });

      setStatus("");
    } catch (err) {
      setStatus("Error verifying letter.");
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFile} />
      {status && <p>{status}</p>}
    </div>
  );
};

export default FileUpload;
