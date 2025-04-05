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

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Brand */}
          <Typography variant="h6" component={Link} to="/" color="white" sx={{ textDecoration: "none" }}>
            VeriLetter
          </Typography>

          {/* Nav Links */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/verify" color="inherit">
              Verify
            </Button>
            {user ? (
              <>
                <Button component={Link} to="/issue" color="inherit">
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

          {/* User Email */}
          {user && (
            <Typography variant="body2" color="white">
              {user.email}
            </Typography>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
