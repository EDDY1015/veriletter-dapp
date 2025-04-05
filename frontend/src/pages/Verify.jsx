import React, { useState } from "react";
import { hashFile, hashStudentInfo } from "../utils/hashing";
import { getVerifierContract } from "../utils/contract";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

function Verify() {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passport, setPassport] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!file) return alert("Please upload a PDF");

    setLoading(true);
    let fileHash, contract;

    try {
      contract = getVerifierContract();
      fileHash = await hashFile(file);

      const data = await contract.getLetterDetails(fileHash);
      const isValid = await contract.isLetterValid(fileHash);

      let studentMatch = null;
      if (firstName && lastName && passport) {
        const studentHash = hashStudentInfo(firstName, lastName, passport);
        studentMatch = studentHash === data.studentHash;
      }

      setResult({
        found: true,
        issuer: data.issuer,
        issueDate: new Date(Number(data.issueDate) * 1000).toLocaleDateString(),
        expiryDate: new Date(Number(data.expiryDate) * 1000).toLocaleDateString(),
        isRevoked: data.isRevoked,
        studentMatch,
        isValid,
        fileHash,
      });
    } catch (err) {
      console.error("Verification failed:", err);
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ✅ Verify Offer Letter
        </Typography>

        <Box component="form" noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="outlined" component="label">
            Upload Offer Letter (PDF)
            <input hidden type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
          </Button>
          {file && (
            <Typography variant="caption" color="text.secondary">
              📎 {file.name}
            </Typography>
          )}

          <TextField
            label="First Name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last Name (optional)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Passport Number (optional)"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading}
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            {loading ? "Verifying..." : "Verify Letter"}
          </Button>
        </Box>

        {/* Result */}
        {result && (
          <Box mt={4}>
            <Divider sx={{ my: 2 }} />
            {result.found ? (
              <Box>
                <Typography variant="subtitle1"><strong>Issuer:</strong> {result.issuer}</Typography>
                <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
                  <strong>File Hash:</strong> {result.fileHash}
                </Typography>
                <Typography>Issued On: {result.issueDate}</Typography>
                <Typography>Expires On: {result.expiryDate}</Typography>
                <Typography>
                  Status:{" "}
                  {result.isRevoked
                    ? "❌ Revoked"
                    : result.isValid
                    ? "✅ Valid"
                    : "⚠️ Expired"}
                </Typography>
                {result.studentMatch !== null && (
                  <Typography>
                    Student Match: {result.studentMatch ? "✅ Match" : "❌ Mismatch"}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography color="error" fontWeight="bold">
                ❌ No matching letter found on-chain.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Verify;
