import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DUMMY_USERS = [
  { email: "admin@veriletter.com", password: "admin123" },
  { email: "issuer@college.com", password: "testpass" },
];

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    const match = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );

    setTimeout(() => {
      if (match) {
        setStatus({ success: true });
        setUser({ email });
        navigate("/issue");
      } else {
        setStatus({ success: false, message: "Invalid credentials" });
      }
      setLoading(false);
    }, 800); // fake delay
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🔐 Issuer Login
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        {status && (
          <Box mt={3}>
            {status.success ? (
              <Alert severity="success">✅ Login successful! Redirecting…</Alert>
            ) : (
              <Alert severity="error">❌ {status.message}</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
