import React, { useState, useRef } from "react";
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
  Alert,
} from "@mui/material";

function Verify() {
  const [file, setFile] = useState(null);
  const [passport, setPassport] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleVerify = async () => {
    if (!file) return alert("Please upload a PDF");

    setLoading(true);
    setResult(null);

    try {
      const contract = getVerifierContract();
      const fileHash = await hashFile(file);
      const data = await contract.getLetterDetails(fileHash);
      const isValid = await contract.isLetterValid(fileHash);

      // Match passport
      let studentMatch = null;
      if (passport.trim()) {
        const studentHash = hashStudentInfo(passport);
        studentMatch = studentHash === data.subjectIdHash;
      }

      // 🔁 Lookup issuer name via backend
      const wallet = data.issuerWallet;
      let issuerName = wallet;
      try {
        const res = await fetch(`http://localhost:5001/issuer-by-wallet/${wallet}`);
        const json = await res.json();
        issuerName = json.name || wallet;
      } catch (e) {
        console.warn("Failed to fetch issuer name. Showing wallet instead.");
      }

      setResult({
        found: true,
        issuerName,
        fileHash,
        issueDate: new Date(Number(data.issueDate) * 1000).toLocaleDateString(),
        expiryDate: new Date(Number(data.expiryDate) * 1000).toLocaleDateString(),
        isRevoked: data.isRevoked,
        isValid,
        studentMatch,
      });

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

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

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="outlined" component="label">
            Upload Offer Letter (PDF)
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileInputRef}
            />
          </Button>
          {file && (
            <Typography variant="caption" color="text.secondary">
              📎 {file.name}
            </Typography>
          )}

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

        {/* Result Display */}
        {result && (
          <Box mt={4}>
            <Divider sx={{ my: 2 }} />
            {result.found ? (
              <Box>
                <Typography variant="subtitle1">
                  <strong>Issuer:</strong> {result.issuerName}
                </Typography>
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
                    Passport Match: {result.studentMatch ? "✅ Match" : "❌ Mismatch"}
                  </Typography>
                )}
              </Box>
            ) : (
              <Alert severity="error">❌ No matching letter found on-chain.</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Verify;
