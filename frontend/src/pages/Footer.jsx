import React from "react";
import { Box, Typography, Container, Grid, Link as MuiLink } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "#000", color: "white", py: 4 }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold">
              VeriLetter
            </Typography>
            <Typography variant="body2" color="gray">
              Blockchain-based verification for official documents.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <MuiLink href="#" color="inherit" sx={{ pr: 2 }}>
              About
            </MuiLink>
            <MuiLink component={Link} to="/contact" color="inherit" sx={{ pr: 2 }}>
              Contact
            </MuiLink>
            <MuiLink href="#" color="inherit">
              Privacy Policy
            </MuiLink>
          </Grid>
        </Grid>
        <Typography variant="body2" color="gray" mt={2}>
          © {new Date().getFullYear()} VeriLetter. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
