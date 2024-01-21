import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { LoginContext } from "../App.js";

function NavBar({ loggedIn }) {
  const navigate = useNavigate();
  const { userData, logout, toggleLoginModal } = useContext(LoginContext);

  const handleLoginLogout = () => {
    if (loggedIn) {
      logout();
      navigate("/");
    } else {
      toggleLoginModal();
    }
  };

  return (
    <AppBar position="static">
      <Box
        display="flex"
        flexDirection="column"
        style={{ margin: "10px", borderRadius: "8px" }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h4">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Inventory Manager
            </Link>
          </Typography>
        </Box>
        <Toolbar>
          <Box>
            <Button color="inherit">
              <Link
                to={"/Inventory"}
                style={{ textDecoration: "none", color: "white" }}
              >
                Check Inventory
              </Link>
            </Button>
          </Box>
          <Box flexGrow={1} display="flex" justifyContent="flex-end">
            <Button color="inherit">
              <Link
                to={
                  loggedIn && userData && userData.id
                    ? `/profile/${userData.id}`
                    : "#"
                }
                style={{
                  textDecoration: "none",
                  color: loggedIn ? "white" : "gray",
                }}
              >
                Profile
              </Link>
            </Button>
            <Button color="inherit" onClick={handleLoginLogout}>
              {loggedIn ? "Logout" : "Login"}
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default NavBar;
