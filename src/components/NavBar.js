// src/components/NavBar.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar({ loggedIn, handleLoginLogout }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/">
          My Website
        </Typography>
        <Button color="inherit" onClick={handleLoginLogout}>
          {loggedIn ? 'Logout' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
