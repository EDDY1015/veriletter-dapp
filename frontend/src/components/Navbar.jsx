import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const isLoggedIn = user && user.email;

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          {/* Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="white"
            sx={{ textDecoration: "none", fontWeight: "bold" }}
          >
            DocuChain
          </Typography>

          {/* Nav Links */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button component={Link} to="/verify" color="inherit">
              Verify
            </Button>
            {isLoggedIn ? (
              <>
                <Button component={Link} to="/dashboard" color="inherit">
                  Issue
                </Button>
                <Button onClick={handleLogout} color="inherit">
                  Logout
                </Button>
              </>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            )}
          </Box>

          {/* User Email (if logged in) */}
          {isLoggedIn && (
            <Typography
              variant="body2"
              color="white"
              sx={{ ml: 2, mt: { xs: 2, sm: 0 }, wordBreak: "break-all" }}
            >
              {user.email}
            </Typography>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
