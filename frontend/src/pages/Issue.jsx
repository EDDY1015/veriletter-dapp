import React, { useState } from "react";
import { getVerifierWithSigner } from "../utils/contract";
import { hashFile, hashStudentInfo } from "../utils/hashing";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
} from "@mui/material";

function Issue() {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passport, setPassport] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!file || !firstName || !lastName || !passport || !expiryDate) {
      return alert("Please fill out all fields and upload a file.");
    }

    setLoading(true);
    setStatus(null);

    try {
      const contract = await getVerifierWithSigner();

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const yourWalletAddress = accounts[0];

      const isAuthorized = await contract.authorizedIssuers(yourWalletAddress);
      if (!isAuthorized) {
        setStatus({ success: false, error: "Your wallet is not authorized to issue letters." });
        setLoading(false);
        return;
      }

      const studentHash = hashStudentInfo(firstName, lastName, passport);
      const fileHash = await hashFile(file);
      const expiry = Math.floor(new Date(expiryDate).getTime() / 1000);

      const tx = await contract.issueOfferLetter(studentHash, fileHash, expiry);
      await tx.wait();

      setStatus({ success: true, fileHash });
      setFirstName("");
      setLastName("");
      setPassport("");
      setFile(null);
      setExpiryDate("");
    } catch (err) {
      console.error("Issue error:", err);
      setStatus({
        success: false,
        error: err?.reason || err?.data?.message || err?.message || "Transaction failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📄 Issue Offer Letter
        </Typography>

        <Box component="form" noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Upload */}
          <Button variant="outlined" component="label">
            Upload Offer Letter (PDF)
            <input hidden type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
          </Button>
          {file && (
            <Typography variant="caption" color="text.secondary">
              📎 {file.name}
            </Typography>
          )}

          {/* Inputs */}
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Passport Number"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            fullWidth
          />
          <TextField
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Submit */}
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            {loading ? "Issuing..." : "Issue Letter"}
          </Button>
        </Box>

        {/* Status */}
        {status && (
          <Box mt={4}>
            <Divider sx={{ mb: 2 }} />
            {status.success ? (
              <Alert severity="success">
                ✅ Letter successfully issued! <br />
                <span style={{ fontSize: "0.8rem", wordBreak: "break-all" }}>
                  File Hash: {status.fileHash}
                </span>
              </Alert>
            ) : (
              <Alert severity="error">❌ {status.error}</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Issue;
