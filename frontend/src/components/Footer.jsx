import React from "react";
import { Box, Typography, Container, Stack, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "black",
        color: "white",
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Left */}
          <Typography variant="body2">
            © {new Date().getFullYear()} DocuChain. All rights reserved.
          </Typography>

          {/* Right Links */}
          <Stack direction="row" spacing={3}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/verify" color="inherit" underline="hover">
              Verify
            </MuiLink>
            <MuiLink component={Link} to="/login" color="inherit" underline="hover">
              Login
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
