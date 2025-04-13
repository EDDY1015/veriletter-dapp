import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      {/* Hero Section with Background Image */}
      <Box
  sx={{
    py: 12,
    px: 2,
    backgroundImage: "url('/pattern6.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
    textAlign: "center",
  }}
>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            DocuChain
          </Typography>
          <Typography variant="h4" color="white" gutterBottom>
            Secure, blockchain-based offer letter verification. 
           
          </Typography>
          <Typography variant="h6" color="white" gutterBottom>  Trusted by institutions. Trusted by immigration.</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <Button variant="contained" component={Link} to="/login">
              Issuer Login
            </Button>
            <Button variant="outlined" component={Link} to="/verify" sx={{ color: "white", borderColor: "white" }}>
              Verify Letter
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          Why DocuChain?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" mb={6}>
          Built to prevent fraud, protect institutions and simplify verification worldwide.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔐 Tamper-Proof Documents
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All offer letters are stored on-chain — verifiable by anyone, immutable forever.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🌍 Borderless Verification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Immigration officers and applicants across countries can verify without contacting the issuer.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚙️ Easy Issuance API
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Institutions and employers issue verified letters via a simple web dashboard or API.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Use Cases */}
      <Box sx={{ bgcolor: "#e0e0e0", py: 8 }}>
        <Container>
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            Who is it for?
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">🏫 Colleges & Universities</Typography>
              <Typography variant="body2" color="text.secondary">
                Securely issue offer letters to foreign students and protect your institution from fraud.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">💼 Employers</Typography>
              <Typography variant="body2" color="text.secondary">
                Issue verified employment letters for international hiring and work visa processes.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">🛂 Immigration Officers</Typography>
              <Typography variant="body2" color="text.secondary">
                Instantly verify the authenticity of letters submitted by applicants.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

    
    </Box>
  );
}

export default Home;
