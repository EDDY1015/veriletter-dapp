import React, { useState, useRef } from "react";
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

function Issue({ canIssue = true, email }) {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passport, setPassport] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!file || !firstName || !lastName || !passport || !expiryDate) {
      return alert("Please fill out all fields and upload a file.");
    }

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("passport", passport);
      formData.append("expiryDate", expiryDate);
      formData.append("email", email);

      const res = await fetch("http://localhost:5001/issue", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ success: true, fileHash: data.fileHash });
        setFirstName("");
        setLastName("");
        setPassport("");
        setFile(null);
        setExpiryDate("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error(data.error || "Issuance failed");
      }
    } catch (err) {
      console.error("Issue error:", err);
      setStatus({
        success: false,
        error: err.message || "Transaction failed",
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

          <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
          <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
          <TextField label="Passport Number" value={passport} onChange={(e) => setPassport(e.target.value)} fullWidth />
          <TextField
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Button
            variant="contained"
            disabled={loading || !canIssue}
            onClick={handleSubmit}
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            {canIssue ? (loading ? "Issuing..." : "Issue Letter") : "Quota Reached"}
          </Button>
        </Box>

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
