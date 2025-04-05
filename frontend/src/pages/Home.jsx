import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        VeriLetter
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Verify official offer letters on-chain. Instantly. Securely.
      </Typography>

      {/* Action Cards */}
      <Grid container spacing={4} mt={4}>
        {/* Issuer Login */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔐 Issuer Login
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                For authorized colleges and companies to issue verified letters.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/login"
                sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
              >
                Login to Issue
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Verify Letter */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ✅ Verify a Letter
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Upload a letter and confirm student details. Available to everyone.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/verify"
                sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
              >
                Verify Letter
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
