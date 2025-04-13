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

// ✅ Use backend env variable (fallback to localhost in dev)
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem("loggedInUser", result.email);
        setUser({ email: result.email });
        navigate("/dashboard");
      } else {
        setStatus({ success: false, message: result.error });
      }
    } catch (err) {
      setStatus({ success: false, message: "Server error" });
    } finally {
      setLoading(false);
    }
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
            <Alert severity={status.success ? "success" : "error"}>
              {status.success
                ? "✅ Login successful! Redirecting…"
                : `❌ ${status.message}`}
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
