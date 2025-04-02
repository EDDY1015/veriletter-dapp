import React from "react";

const LetterDetails = ({ data }) => {
  if (!data) return null;

  return (
    <div className="result-card">
      <p><strong>Status:</strong> {data.isValid ? "✅ Valid" : "❌ Invalid"}</p>
      <p><strong>Issuer:</strong> {data.issuer}</p>
      <p><strong>Issue Date:</strong> {data.issueDate}</p>
      <p><strong>Expiry:</strong> {data.expiryDate}</p>
      <p><strong>Revoked:</strong> {data.revoked ? "Yes" : "No"}</p>
      <p><strong>Hash:</strong> {data.fileHash}</p>
    </div>
  );
};

export default LetterDetails;
